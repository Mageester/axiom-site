import type { OmniscientLead } from './omniscient';

type ZipEntry = {
    name: string;
    data: Uint8Array;
};

type SheetCell =
    | { ref: string; type: 'inlineStr'; value: string }
    | { ref: string; type: 'n'; value: number };

type SheetHyperlink = {
    ref: string;
    relId: string;
    target: string;
};

const ZIP_VERSION = 20;
const CRC32_TABLE = buildCrc32Table();
const textEncoder = new TextEncoder();

function buildCrc32Table() {
    const table = new Uint32Array(256);
    for (let index = 0; index < 256; index += 1) {
        let value = index;
        for (let shift = 0; shift < 8; shift += 1) {
            value = (value & 1) !== 0 ? (0xedb88320 ^ (value >>> 1)) : (value >>> 1);
        }
        table[index] = value >>> 0;
    }
    return table;
}

function crc32(bytes: Uint8Array) {
    let value = 0xffffffff;
    for (const byte of bytes) {
        value = CRC32_TABLE[(value ^ byte) & 0xff] ^ (value >>> 8);
    }
    return (value ^ 0xffffffff) >>> 0;
}

function writeUint16(view: DataView, offset: number, value: number) {
    view.setUint16(offset, value, true);
}

function writeUint32(view: DataView, offset: number, value: number) {
    view.setUint32(offset, value >>> 0, true);
}

function toDosDateTime(date: Date) {
    const year = Math.max(date.getFullYear(), 1980);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = Math.floor(date.getSeconds() / 2);

    return {
        date: ((year - 1980) << 9) | (month << 5) | day,
        time: (hours << 11) | (minutes << 5) | seconds,
    };
}

function concatBytes(chunks: Uint8Array[]) {
    const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
    const output = new Uint8Array(totalLength);
    let offset = 0;

    for (const chunk of chunks) {
        output.set(chunk, offset);
        offset += chunk.length;
    }

    return output;
}

function createZip(entries: ZipEntry[]) {
    const now = toDosDateTime(new Date());
    const localParts: Uint8Array[] = [];
    const centralParts: Uint8Array[] = [];
    let localOffset = 0;

    for (const entry of entries) {
        const nameBytes = textEncoder.encode(entry.name);
        const dataBytes = entry.data;
        const checksum = crc32(dataBytes);

        const localHeader = new Uint8Array(30 + nameBytes.length);
        const localView = new DataView(localHeader.buffer);
        writeUint32(localView, 0, 0x04034b50);
        writeUint16(localView, 4, ZIP_VERSION);
        writeUint16(localView, 6, 0);
        writeUint16(localView, 8, 0);
        writeUint16(localView, 10, now.time);
        writeUint16(localView, 12, now.date);
        writeUint32(localView, 14, checksum);
        writeUint32(localView, 18, dataBytes.length);
        writeUint32(localView, 22, dataBytes.length);
        writeUint16(localView, 26, nameBytes.length);
        writeUint16(localView, 28, 0);
        localHeader.set(nameBytes, 30);

        localParts.push(localHeader, dataBytes);

        const centralHeader = new Uint8Array(46 + nameBytes.length);
        const centralView = new DataView(centralHeader.buffer);
        writeUint32(centralView, 0, 0x02014b50);
        writeUint16(centralView, 4, ZIP_VERSION);
        writeUint16(centralView, 6, ZIP_VERSION);
        writeUint16(centralView, 8, 0);
        writeUint16(centralView, 10, 0);
        writeUint16(centralView, 12, now.time);
        writeUint16(centralView, 14, now.date);
        writeUint32(centralView, 16, checksum);
        writeUint32(centralView, 20, dataBytes.length);
        writeUint32(centralView, 24, dataBytes.length);
        writeUint16(centralView, 28, nameBytes.length);
        writeUint16(centralView, 30, 0);
        writeUint16(centralView, 32, 0);
        writeUint16(centralView, 34, 0);
        writeUint16(centralView, 36, 0);
        writeUint32(centralView, 38, 0);
        writeUint32(centralView, 42, localOffset);
        centralHeader.set(nameBytes, 46);
        centralParts.push(centralHeader);

        localOffset += localHeader.length + dataBytes.length;
    }

    const centralDirectory = concatBytes(centralParts);
    const endRecord = new Uint8Array(22);
    const endView = new DataView(endRecord.buffer);
    writeUint32(endView, 0, 0x06054b50);
    writeUint16(endView, 4, 0);
    writeUint16(endView, 6, 0);
    writeUint16(endView, 8, entries.length);
    writeUint16(endView, 10, entries.length);
    writeUint32(endView, 12, centralDirectory.length);
    writeUint32(endView, 16, localOffset);
    writeUint16(endView, 20, 0);

    return concatBytes([...localParts, centralDirectory, endRecord]);
}

function xmlEscape(value: string) {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

function xmlText(value: string) {
    const escaped = xmlEscape(value);
    const preserve = /^[\s]|[\s]$/.test(value) || /\n/.test(value) || /  /.test(value);
    return preserve ? `<t xml:space="preserve">${escaped}</t>` : `<t>${escaped}</t>`;
}

function columnLetter(index: number) {
    let current = index + 1;
    let output = '';

    while (current > 0) {
        const remainder = (current - 1) % 26;
        output = String.fromCharCode(65 + remainder) + output;
        current = Math.floor((current - 1) / 26);
    }

    return output;
}

function safeDate(value: string | null | undefined) {
    if (!value) return '';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toISOString();
}

function phoneDigits(value: string | null | undefined) {
    if (!value) return '';
    const digits = value.replace(/\D/g, '');
    if (digits.length === 10) {
        return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    }
    if (digits.length === 11 && digits.startsWith('1')) {
        return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
    }
    return value;
}

function parseTopFixes(value: string | null | undefined) {
    if (!value) return [];
    try {
        const parsed = JSON.parse(value) as { topFixes?: string[] };
        return Array.isArray(parsed?.topFixes) ? parsed.topFixes : [];
    } catch {
        return [];
    }
}

function parsePainSignals(value: string | null | undefined) {
    if (!value) return [];
    try {
        const parsed = JSON.parse(value) as Array<{ type?: string; evidence?: string }>;
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function buildSheetRows(leads: OmniscientLead[]) {
    const header = [
        'Tier',
        'Axiom Score',
        'Business Name',
        'Niche',
        'City',
        'Address',
        'Phone',
        'Email',
        'Website',
        'Social Link',
        'Website Status',
        'Website Grade',
        'Pain Summary',
        'Call Opener',
        'Follow Up Question',
        'Tactical Note',
        'Contact Name',
        'Created At',
        'Lead ID',
    ];

    const rows: Array<Array<string | number>> = [header];
    const hyperlinks: SheetHyperlink[] = [];
    let hyperlinkIndex = 1;

    for (const lead of leads) {
        const topFixes = parseTopFixes(lead.axiomWebsiteAssessment).slice(0, 3).join('; ');
        const painSummary = parsePainSignals(lead.painSignals)
            .slice(0, 3)
            .map((signal) => `${signal.type || 'PAIN'}: ${signal.evidence || ''}`)
            .join(' | ');

        const rowIndex = rows.length + 1;
        rows.push([
            lead.axiomTier || '',
            lead.axiomScore ?? '',
            lead.businessName || '',
            lead.niche || '',
            lead.city || '',
            lead.address || '',
            phoneDigits(lead.phone),
            lead.email || '',
            lead.websiteUrl || '',
            lead.socialLink || '',
            lead.websiteStatus || '',
            lead.websiteGrade || '',
            topFixes ? `${painSummary}${painSummary ? ' | ' : ''}Top fixes: ${topFixes}` : painSummary,
            lead.callOpener || '',
            lead.followUpQuestion || '',
            lead.tacticalNote || '',
            lead.contactName || '',
            safeDate(lead.createdAt),
            String(lead.id),
        ]);

        const phoneRef = `${columnLetter(6)}${rowIndex}`;
        const emailRef = `${columnLetter(7)}${rowIndex}`;
        const websiteRef = `${columnLetter(8)}${rowIndex}`;

        if (lead.phone) {
            const digits = lead.phone.replace(/\D/g, '');
            if (digits) {
                hyperlinks.push({ ref: phoneRef, relId: `rId${hyperlinkIndex++}`, target: `tel:${digits}` });
            }
        }

        if (lead.email) {
            hyperlinks.push({ ref: emailRef, relId: `rId${hyperlinkIndex++}`, target: `mailto:${lead.email}` });
        }

        if (lead.websiteUrl) {
            hyperlinks.push({
                ref: websiteRef,
                relId: `rId${hyperlinkIndex++}`,
                target: lead.websiteUrl.startsWith('http') ? lead.websiteUrl : `https://${lead.websiteUrl}`,
            });
        }
    }

    return { hyperlinks, rows };
}

function buildSheetXml(rows: Array<Array<string | number>>, hyperlinks: SheetHyperlink[]) {
    const columnWidths = [8, 12, 30, 20, 20, 34, 18, 28, 28, 28, 14, 12, 48, 54, 42, 42, 24, 22, 12];
    const colsXml = columnWidths
        .map((width, index) => `<col min="${index + 1}" max="${index + 1}" width="${width}" customWidth="1"/>`)
        .join('');

    const rowsXml = rows.map((row, rowIndex) => {
        const cells: SheetCell[] = row.flatMap((value, columnIndex) => {
            if (value === '') return [];
            const ref = `${columnLetter(columnIndex)}${rowIndex + 1}`;
            if (typeof value === 'number') {
                return [{ ref, type: 'n', value }];
            }
            return [{ ref, type: 'inlineStr', value: String(value) }];
        });

        const cellsXml = cells.map((cell) => {
            if (cell.type === 'n') {
                return `<c r="${cell.ref}"><v>${cell.value}</v></c>`;
            }
            return `<c r="${cell.ref}" t="inlineStr"><is>${xmlText(cell.value)}</is></c>`;
        }).join('');

        return `<row r="${rowIndex + 1}">${cellsXml}</row>`;
    }).join('');

    const hyperlinksXml = hyperlinks.length > 0
        ? `<hyperlinks>${hyperlinks.map((link) => `<hyperlink ref="${link.ref}" r:id="${link.relId}"/>`).join('')}</hyperlinks>`
        : '';

    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <dimension ref="A1:S${rows.length}"/>
  <sheetViews>
    <sheetView workbookViewId="0">
      <pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/>
      <selection pane="bottomLeft" activeCell="A2" sqref="A2"/>
    </sheetView>
  </sheetViews>
  <sheetFormatPr defaultRowHeight="20"/>
  <cols>${colsXml}</cols>
  <sheetData>${rowsXml}</sheetData>
  <autoFilter ref="A1:S1"/>
  ${hyperlinksXml}
</worksheet>`;
}

function buildSheetRelationshipsXml(hyperlinks: SheetHyperlink[]) {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  ${hyperlinks.map((link) => `<Relationship Id="${link.relId}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink" Target="${xmlEscape(link.target)}" TargetMode="External"/>`).join('')}
</Relationships>`;
}

function buildWorkbookXml() {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <bookViews>
    <workbookView activeTab="0"/>
  </bookViews>
  <sheets>
    <sheet name="Leads" sheetId="1" r:id="rId1"/>
  </sheets>
</workbook>`;
}

function buildWorkbookRelationshipsXml() {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`;
}

function buildStylesXml() {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <fonts count="1">
    <font>
      <sz val="11"/>
      <name val="Calibri"/>
      <family val="2"/>
    </font>
  </fonts>
  <fills count="2">
    <fill><patternFill patternType="none"/></fill>
    <fill><patternFill patternType="gray125"/></fill>
  </fills>
  <borders count="1">
    <border><left/><right/><top/><bottom/><diagonal/></border>
  </borders>
  <cellStyleXfs count="1">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0"/>
  </cellStyleXfs>
  <cellXfs count="1">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
  </cellXfs>
  <cellStyles count="1">
    <cellStyle name="Normal" xfId="0" builtinId="0"/>
  </cellStyles>
</styleSheet>`;
}

function buildRootRelationshipsXml() {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`;
}

function buildContentTypesXml(hasHyperlinks: boolean) {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
  ${hasHyperlinks ? '<Override PartName="/xl/worksheets/_rels/sheet1.xml.rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' : ''}
</Types>`;
}

export function sortOmniscientLeadsDeterministic(leads: OmniscientLead[]) {
    leads.sort((a, b) => {
        const scoreDiff = Number(b.axiomScore || 0) - Number(a.axiomScore || 0);
        if (scoreDiff !== 0) return scoreDiff;
        const dateDiff = safeDate(b.createdAt).localeCompare(safeDate(a.createdAt));
        if (dateDiff !== 0) return dateDiff;
        return String(a.businessName).localeCompare(String(b.businessName));
    });
}

export function buildOmniscientExportFilename(format: 'csv' | 'xlsx', filters: {
    city?: string | null;
    niche?: string | null;
    preset?: string | null;
    tier?: string[] | null;
}) {
    const parts = ['omniscient', filters.preset || 'call-sheet'];
    if (filters.tier && filters.tier.length > 0) parts.push(`tier-${filters.tier.join('-')}`);
    if (filters.city) parts.push(`city-${filters.city.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`);
    if (filters.niche) parts.push(`niche-${filters.niche.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`);

    const stamp = new Date().toISOString().replace(/[:]/g, '').slice(0, 15);
    parts.push(stamp);
    return `${parts.join('__')}.${format}`;
}

export async function generateOmniscientXlsx(leads: OmniscientLead[]): Promise<ArrayBuffer> {
    const { rows, hyperlinks } = buildSheetRows(leads);
    const zipEntries: ZipEntry[] = [
        { name: '[Content_Types].xml', data: textEncoder.encode(buildContentTypesXml(hyperlinks.length > 0)) },
        { name: '_rels/.rels', data: textEncoder.encode(buildRootRelationshipsXml()) },
        { name: 'xl/workbook.xml', data: textEncoder.encode(buildWorkbookXml()) },
        { name: 'xl/_rels/workbook.xml.rels', data: textEncoder.encode(buildWorkbookRelationshipsXml()) },
        { name: 'xl/styles.xml', data: textEncoder.encode(buildStylesXml()) },
        { name: 'xl/worksheets/sheet1.xml', data: textEncoder.encode(buildSheetXml(rows, hyperlinks)) },
    ];

    if (hyperlinks.length > 0) {
        zipEntries.push({
            name: 'xl/worksheets/_rels/sheet1.xml.rels',
            data: textEncoder.encode(buildSheetRelationshipsXml(hyperlinks)),
        });
    }

    const archive = createZip(zipEntries);
    return archive.buffer.slice(archive.byteOffset, archive.byteOffset + archive.byteLength);
}
