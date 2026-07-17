#!/usr/bin/env python3
# /// script
# dependencies = ["reportlab>=4.0"]
# ///
"""Generate the public Transformation Program documentation packet."""

from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    KeepTogether,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


OUTPUT = Path(__file__).resolve().parents[1] / "public" / "transformation-program-pd-packet.pdf"

GREEN = colors.HexColor("#174c3e")
DARK = colors.HexColor("#17211f")
GOLD = colors.HexColor("#c99720")
MUTED = colors.HexColor("#59645f")
LINE = colors.HexColor("#d7ddd9")
PALE = colors.HexColor("#f1f4f2")
WHITE = colors.white

PAGE_WIDTH, PAGE_HEIGHT = letter
LEFT = 0.7 * inch
RIGHT = 0.7 * inch
TOP = 0.65 * inch
BOTTOM = 0.6 * inch

styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name="Eyebrow", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=8.5, leading=11, textColor=GOLD, spaceAfter=10))
styles.add(ParagraphStyle(name="Display", parent=styles["Title"], fontName="Helvetica", fontSize=31, leading=35, textColor=GREEN, spaceAfter=8))
styles.add(ParagraphStyle(name="Subtitle", parent=styles["Normal"], fontName="Helvetica", fontSize=13, leading=17, textColor=MUTED, spaceAfter=24))
styles.add(ParagraphStyle(name="H1Green", parent=styles["Heading1"], fontName="Helvetica", fontSize=26, leading=31, textColor=GREEN, spaceAfter=14))
styles.add(ParagraphStyle(name="H2Green", parent=styles["Heading2"], fontName="Helvetica", fontSize=14, leading=18, textColor=GREEN, spaceBefore=8, spaceAfter=5))
styles.add(ParagraphStyle(name="BodyPacket", parent=styles["BodyText"], fontName="Helvetica", fontSize=9.5, leading=14, textColor=DARK, spaceAfter=8))
styles.add(ParagraphStyle(name="BodySmall", parent=styles["BodyText"], fontName="Helvetica", fontSize=8.5, leading=12, textColor=MUTED))
styles.add(ParagraphStyle(name="Label", parent=styles["Normal"], fontName="Helvetica", fontSize=7.8, leading=10, textColor=MUTED))
styles.add(ParagraphStyle(name="Value", parent=styles["Normal"], fontName="Helvetica", fontSize=9.5, leading=12, textColor=DARK))
styles.add(ParagraphStyle(name="ValueWhite", parent=styles["Value"], textColor=WHITE))
styles.add(ParagraphStyle(name="Week", parent=styles["Normal"], fontName="Helvetica", fontSize=11, leading=14, alignment=TA_CENTER, textColor=WHITE))
styles.add(ParagraphStyle(name="ModuleTitle", parent=styles["Normal"], fontName="Helvetica", fontSize=11.5, leading=14, textColor=GREEN, spaceAfter=3))
styles.add(ParagraphStyle(name="ModuleBody", parent=styles["Normal"], fontName="Helvetica", fontSize=8.5, leading=12, textColor=MUTED))
styles.add(ParagraphStyle(name="FormLabel", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=8, leading=10, textColor=MUTED, spaceAfter=8))
styles.add(ParagraphStyle(name="FormLine", parent=styles["Normal"], fontName="Helvetica", fontSize=9, leading=14, textColor=colors.HexColor("#a2aaa6")))


def footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(LINE)
    canvas.setLineWidth(0.5)
    canvas.line(LEFT, 0.45 * inch, PAGE_WIDTH - RIGHT, 0.45 * inch)
    canvas.setFont("Helvetica-Bold", 7.5)
    canvas.setFillColor(GREEN)
    canvas.drawString(LEFT, 0.25 * inch, "BEHAVIOR SCHOOL LLC")
    canvas.setFont("Helvetica", 7.5)
    canvas.setFillColor(MUTED)
    canvas.drawRightString(PAGE_WIDTH - RIGHT, 0.25 * inch, f"behaviorschool.com | Page {doc.page}")
    canvas.restoreState()


def info_table(rows, label_width=1.35 * inch):
    table = Table(
        [[Paragraph(label.upper(), styles["Label"]), Paragraph(value, styles["Value"])] for label, value in rows],
        colWidths=[label_width, PAGE_WIDTH - LEFT - RIGHT - label_width],
        hAlign="LEFT",
    )
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), PALE),
        ("GRID", (0, 0), (-1, -1), 0.45, LINE),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 10),
        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
    ]))
    return table


def module_row(number, title, copy):
    week_box = Table([[Paragraph(number, styles["Week"])]], colWidths=[0.45 * inch], rowHeights=[0.38 * inch])
    week_box.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), GREEN), ("VALIGN", (0, 0), (-1, -1), "MIDDLE")]))
    content = [Paragraph(title, styles["ModuleTitle"]), Paragraph(copy, styles["ModuleBody"])]
    row = Table([[week_box, content]], colWidths=[0.58 * inch, PAGE_WIDTH - LEFT - RIGHT - 0.58 * inch])
    row.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LINEBELOW", (0, 0), (-1, -1), 0.45, LINE),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
    ]))
    return row


def form_field(label, lines=2, width=3.22 * inch):
    content = [Paragraph(label.upper(), styles["FormLabel"])]
    content.extend(Paragraph("________________________________________", styles["FormLine"]) for _ in range(lines))
    field = Table([[content]], colWidths=[width])
    field.setStyle(TableStyle([
        ("BOX", (0, 0), (-1, -1), 0.7, LINE),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 12),
        ("RIGHTPADDING", (0, 0), (-1, -1), 12),
        ("TOPPADDING", (0, 0), (-1, -1), 11),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 11),
    ]))
    return field


def build_packet():
    doc = BaseDocTemplate(
        str(OUTPUT),
        pagesize=letter,
        leftMargin=LEFT,
        rightMargin=RIGHT,
        topMargin=TOP,
        bottomMargin=BOTTOM,
        title="School BCBA Transformation Program - Professional Development Documentation Packet",
        author="Behavior School LLC",
        subject="Program curriculum, participation, pricing, and district purchasing documentation",
    )
    frame = Frame(LEFT, BOTTOM, PAGE_WIDTH - LEFT - RIGHT, PAGE_HEIGHT - TOP - BOTTOM, id="content", leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
    doc.addPageTemplates([PageTemplate(id="packet", frames=[frame], onPage=footer)])

    story = [
        Paragraph("BEHAVIOR SCHOOL | SMALL-COHORT PROGRAM", styles["Eyebrow"]),
        Paragraph("School BCBA<br/>Transformation Program", styles["Display"]),
        Paragraph("Professional Development Documentation Packet", styles["Subtitle"]),
        Paragraph("Program purpose", styles["H2Green"]),
        Paragraph(
            "A six-week applied professional-development cohort for certified BCBAs responsible for behavior support in K-12 schools or districts. The program develops assessment judgment, school-based functional-analysis skills, ACT-informed contextual assessment tools, evidence-aligned intervention planning, and team implementation systems.",
            styles["BodyPacket"],
        ),
        Paragraph(
            "Participants apply the work, to the best of their ability, to a student, staff member, team, or system in their current setting. Application remains within each participant's role, competence, permissions, safety procedures, and local requirements.",
            styles["BodyPacket"],
        ),
        Spacer(1, 8),
        info_table([
            ("Format", "Six live weekly sessions"),
            ("Schedule", "Current cohort dates and meeting times are confirmed before enrollment"),
            ("Audience", "Certified BCBAs working in or entering K-12 school practice"),
            ("Cohort", "Small cohort"),
            ("Pay in full", "$1,997"),
            ("Payment plan", "Three automatic monthly payments of $697 ($2,091 total)"),
            ("District billing", "Purchase orders and invoice payments accepted"),
        ]),
        Spacer(1, 14),
        Paragraph("Continuing education", styles["H2Green"]),
        Paragraph(
            "Learning CEUs are included for eligible sessions completed under the program's attendance and participation requirements. The exact number available and documentation requirements are provided with enrollment materials.",
            styles["BodyPacket"],
        ),
        Paragraph("Recordings", styles["H2Green"]),
        Paragraph("Live sessions are recorded and made available in the student portal within 24 hours.", styles["BodyPacket"]),
        PageBreak(),
        Paragraph("PROGRAM CURRICULUM", styles["Eyebrow"]),
        Paragraph("Six weeks of applied decision-making", styles["H1Green"]),
        Paragraph("Each week begins with a recurring school-practice problem and connects the methods to work in the participant's current setting.", styles["BodyPacket"]),
        module_row("01", "From referral to assessment decision", "Build a repeatable way to clarify the concern, review context, and select an assessment path proportionate to the case."),
        module_row("02", "Testing the functional hypothesis before the BIP", "Examine how testing a functional hypothesis can clarify intervention selection before BIP development, including when experimental analysis is warranted and feasible."),
        module_row("03", "School-based functional analysis formats", "Study brief, trial-based, latency, precursor, and analog FA, then select and plan around school constraints, safety, assent, and authorization."),
        module_row("04", "ACT-informed functional assessment", "Use ACT-informed interview and mapping tools to examine rule-governed and avoidance patterns while keeping conclusions tied to observable behavior and testable hypotheses."),
        module_row("05", "From assessment evidence to intervention", "Translate what the team knows into feasible prevention, teaching, reinforcement, response, and progress-monitoring decisions."),
        module_row("06", "Leading implementation through teams", "Build the communication, training, fidelity, review, and escalation routines needed to lead behavior support through other people."),
        Spacer(1, 12),
        KeepTogether([
            Paragraph("Functional-analysis methods addressed", styles["H2Green"]),
            Paragraph("Brief, trial-based, latency, precursor, and analog functional analyses. Selection depends on the referral question, case, setting, practitioner competence, safety, authorization, and feasibility.", styles["BodyPacket"]),
        ]),
        KeepTogether([
            Paragraph("Assessment distinction", styles["H2Green"]),
            Paragraph("Indirect and descriptive assessment can inform hypotheses and FA design, but they do not demonstrate a causal functional relation. A functional analysis systematically compares test and control conditions to evaluate a functional relation.", styles["BodyPacket"]),
        ]),
        KeepTogether([
            Paragraph("Scope and safeguards", styles["H2Green"]),
            Paragraph("Not every student requires a functional analysis. Any analysis must fit the practitioner's competence, role, authorization, safety planning, assent practices, and local requirements.", styles["BodyPacket"]),
        ]),
        PageBreak(),
        Paragraph("PARTICIPATION AND PURCHASING", styles["Eyebrow"]),
        Paragraph("Documentation for supervisors and purchasing offices", styles["H1Green"]),
        Paragraph("Applied work", styles["H2Green"]),
        Paragraph(
            "Participants apply each week's work directly to a student, staff member, team, or system when appropriate and permitted. Participants define a testable functional hypothesis for a current case and decide whether and how it could be tested safely and feasibly. They also use a school-based FA planning guide, ACT-informed contextual assessment map, evidence-to-intervention check, staff training and fidelity routine, and caseload review system.",
            styles["BodyPacket"],
        ),
        Paragraph("Instructor", styles["H2Green"]),
        Paragraph("Rob Spain, BCBA, IBA, brings more than 25 years of behavior-analytic work across school, district, teaching, and clinical settings.", styles["BodyPacket"]),
        Paragraph("District payment process", styles["H2Green"]),
        Paragraph("District purchase orders and invoice payments are accepted. A seat is held after a signed purchase order or written district payment approval is received. A W-9 and supporting program documentation are available on request.", styles["BodyPacket"]),
        Spacer(1, 10),
        info_table([
            ("Vendor", "Behavior School LLC"),
            ("Program", "School BCBA Transformation Program"),
            ("Tuition", "$1,997 per participant"),
            ("Payment plan", "Three automatic monthly payments of $697 ($2,091 total)"),
            ("Contact", "Rob Spain, BCBA - rob@behaviorschool.com"),
            ("Website", "behaviorschool.com/transformation-program"),
            ("W-9", "Available upon request"),
        ]),
        Spacer(1, 14),
        Paragraph("Refund policy", styles["H2Green"]),
        Paragraph("A refund may be requested within five calendar days of payment. After that window, cohort seats are committed and are not refundable except where required by law.", styles["BodyPacket"]),
    ]

    contact = Table([[Paragraph("Questions or district paperwork", styles["ValueWhite"]), Paragraph("rob@behaviorschool.com", styles["ValueWhite"])]], colWidths=[3.4 * inch, 3.3 * inch])
    contact.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), GREEN),
        ("TEXTCOLOR", (0, 0), (-1, -1), WHITE),
        ("LEFTPADDING", (0, 0), (-1, -1), 12),
        ("RIGHTPADDING", (0, 0), (-1, -1), 12),
        ("TOPPADDING", (0, 0), (-1, -1), 10),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
    ]))
    story.extend([Spacer(1, 8), contact])
    story.extend([
        PageBreak(),
        Paragraph("BEHAVIOR SCHOOL | DISTRICT BILLING", styles["Eyebrow"]),
        Paragraph("Professional Development Invoice", styles["H1Green"]),
        Paragraph("For submission to a district business office or human-resources department", styles["Subtitle"]),
        Table(
            [
                [form_field("Bill to - employee name"), form_field("Bill to - district or employer")],
                [form_field("Invoice date"), form_field("Invoice number")],
                [form_field("District accounts-payable address", 3, 6.57 * inch), ""],
            ],
            colWidths=[3.35 * inch, 3.35 * inch],
            hAlign="LEFT",
            style=TableStyle([
                ("SPAN", (0, 2), (1, 2)),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 9),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
            ]),
        ),
        Spacer(1, 12),
        Paragraph("Invoice detail", styles["H2Green"]),
    ])

    invoice_detail = Table(
        [
            [Paragraph("DESCRIPTION", styles["Label"]), Paragraph("SCHEDULE", styles["Label"]), Paragraph("AMOUNT", styles["Label"])],
            [
                Paragraph("<b>School BCBA Transformation Program</b><br/>Six live weekly professional-development sessions for certified BCBAs. Includes live instruction, session recordings, eligible Learning CEUs, and program materials.", styles["BodyPacket"]),
                Paragraph("Confirmed before enrollment", styles["BodyPacket"]),
                Paragraph("$1,997.00", styles["BodyPacket"]),
            ],
            [Paragraph("<b>Total due</b>", styles["BodyPacket"]), "", Paragraph("<b>$1,997.00</b>", styles["BodyPacket"])],
        ],
        colWidths=[3.75 * inch, 1.65 * inch, 1.3 * inch],
        hAlign="LEFT",
    )
    invoice_detail.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), PALE),
        ("GRID", (0, 0), (-1, -1), 0.5, LINE),
        ("SPAN", (0, 2), (1, 2)),
        ("ALIGN", (2, 0), (2, -1), "RIGHT"),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 9),
        ("RIGHTPADDING", (0, 0), (-1, -1), 9),
        ("TOPPADDING", (0, 0), (-1, -1), 9),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
    ]))
    story.extend([
        invoice_detail,
        Spacer(1, 16),
        Paragraph("District payment", styles["H2Green"]),
        Paragraph("For purchase-order or invoice billing, send the completed invoice and district purchase-order information to rob@behaviorschool.com. A seat is held after a signed purchase order or written district payment approval is received.", styles["BodyPacket"]),
        Paragraph("Online program information: behaviorschool.com/transformation-program", styles["BodyPacket"]),
        PageBreak(),
        Paragraph("TAX AND REMITTANCE INFORMATION", styles["Eyebrow"]),
        Paragraph("Documentation for district vendor setup", styles["H1Green"]),
        Spacer(1, 8),
        Paragraph("W-9 information", styles["H2Green"]),
        info_table([
            ("Business name", "Behavior School LLC"),
            ("EIN / tax ID", "Provided with the W-9 upon request"),
            ("W-9 request", "Email rob@behaviorschool.com and include the district accounts-payable contact"),
        ]),
        Spacer(1, 18),
        Paragraph("Remittance and contact", styles["H2Green"]),
        info_table([
            ("Vendor", "Behavior School LLC"),
            ("Contact", "Rob Spain, BCBA - rob@behaviorschool.com"),
            ("Website", "behaviorschool.com"),
            ("Program", "behaviorschool.com/transformation-program"),
        ]),
        Spacer(1, 20),
        Paragraph("This document is provided for professional-development reimbursement and district purchasing purposes.", styles["BodySmall"]),
    ])
    doc.build(story)


if __name__ == "__main__":
    build_packet()
    print(f"Generated {OUTPUT}")
