"use client";

import { FormEvent, useState } from "react";

type ContactResponse = {
  ok: boolean;
  error?: string;
};

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const payload = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      company: String(formData.get("company") || ""),
      message: String(formData.get("message") || ""),
    };

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = (await res.json()) as ContactResponse;

      if (!res.ok || !data.ok) {
        setError(data.error || "Unable to transmit message.");
        return;
      }

      event.currentTarget.reset();
      setSuccess(true);
    } catch {
      setError("Network interference detected. Retry in a moment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-4xl px-6 py-20">
      <div className="rounded-3xl border border-white/15 bg-white/5 p-8 shadow-glass backdrop-blur-2xl md:p-10">
        <h2 className="text-3xl font-semibold text-white md:text-4xl">Initiate Contact</h2>
        <p className="mt-3 text-sm text-white/70 md:text-base">Secure intake for elite project deployments.</p>

        <form onSubmit={onSubmit} className="mt-8 grid gap-4">
          <input required name="name" placeholder="Name" className="rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-white placeholder:text-white/45 focus:border-[#B05D41] focus:outline-none" />
          <input required type="email" name="email" placeholder="Email" className="rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-white placeholder:text-white/45 focus:border-[#B05D41] focus:outline-none" />
          <input name="company" placeholder="Company" className="rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-white placeholder:text-white/45 focus:border-[#B05D41] focus:outline-none" />
          <textarea required name="message" rows={5} placeholder="Mission brief" className="rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-white placeholder:text-white/45 focus:border-[#B05D41] focus:outline-none" />

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 rounded-xl bg-[#B05D41] px-6 py-3 font-semibold uppercase tracking-wider text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-65"
          >
            {isSubmitting ? "Transmitting..." : "Transmit"}
          </button>
        </form>

        {success ? (
          <div className="mt-5 rounded-2xl border border-[#B05D41]/50 bg-[#B05D41]/15 px-4 py-3 text-sm text-white backdrop-blur-xl">
            Transmission Received
          </div>
        ) : null}

        {error ? <p className="mt-5 text-sm text-red-300">{error}</p> : null}
      </div>
    </section>
  );
}
