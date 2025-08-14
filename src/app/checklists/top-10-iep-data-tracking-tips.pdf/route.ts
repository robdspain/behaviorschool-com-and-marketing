import { NextRequest } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export async function GET(_req: NextRequest) {
	const pdfDoc = await PDFDocument.create();
	const page = pdfDoc.addPage([612, 792]); // Letter
	const { width, height } = page.getSize();
	const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
	const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

	const title = "Top 10 IEP Data Tracking Tips";
	page.drawText(title, {
		x: 50,
		y: height - 80,
		size: 24,
		font: bold,
		color: rgb(0.1, 0.1, 0.1),
	});

	const subtitle = "Practical guidance for special education teachers and case managers";
	page.drawText(subtitle, {
		x: 50,
		y: height - 110,
		size: 12,
		font,
		color: rgb(0.25, 0.25, 0.25),
	});

	const tips = [
		"Define measurable, observable IEP goals with clear mastery criteria.",
		"Align lesson plans to goals; collect only data you will use.",
		"Pick a data method (trial-by-trial, frequency, duration, latency, ABC) that fits the skill.",
		"Use consistent prompts and record prompt levels to track independence.",
		"Schedule brief data windows; automate reminders to reduce missed entries.",
		"Graph progress weekly; annotate changes in instruction or context.",
		"Summarize trends in plain language for families and teams.",
		"Document accommodations and service minutes alongside skill data.",
		"Audit for IDEA compliance before each grading period.",
		"Generate progress reports from your data—avoid copy‑paste boilerplate.",
	];

	let y = height - 150;
	const lineHeight = 20;
	for (let i = 0; i < tips.length; i++) {
		if (y < 60) {
			const next = pdfDoc.addPage([612, 792]);
			y = next.getSize().height - 60;
			next.drawText(`${i + 1}. ${tips[i]}`, { x: 50, y, size: 12, font, color: rgb(0.15, 0.15, 0.15) });
			y -= lineHeight;
			continue;
		}
		page.drawText(`${i + 1}. ${tips[i]}`, { x: 50, y, size: 12, font, color: rgb(0.15, 0.15, 0.15) });
		y -= lineHeight;
	}

	const pdfBytes = await pdfDoc.save();
	const body = Buffer.from(pdfBytes);
	return new Response(body, {
		headers: {
			"Content-Type": "application/pdf",
			"Content-Disposition": "attachment; filename=\"top-10-iep-data-tracking-tips.pdf\"",
			"Cache-Control": "public, max-age=31536000, immutable",
		},
	});
}