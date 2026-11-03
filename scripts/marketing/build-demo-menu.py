"""Original printable example, using the same authored cafe records as the live renderer.
Run with a Python environment containing reportlab; no application dependency is added.
"""
import json
from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4

root = Path(__file__).resolve().parents[2]
content = json.loads((root / "docs/taplo-rebuild/fixtures/business-content-inputs.json").read_text())["sunday-counter"]
target = root / "public/workbench/corner-table-menu.pdf"
target.parent.mkdir(parents=True, exist_ok=True)
pdf = canvas.Canvas(str(target), pagesize=A4, invariant=1)
pdf.setTitle("No. 6 Coffee - menu")
pdf.setAuthor("Taplo")
w, h = A4
cream, ink, green = map(HexColor, ["#ffffff", "#090b10", "#1645ff"])
pdf.setFillColor(cream); pdf.rect(0, 0, w, h, fill=1, stroke=0)
pdf.setFillColor(green); pdf.setFont("Helvetica-Bold", 10)
pdf.drawString(52, h - 57, "AT THE COUNTER")
pdf.setFillColor(ink); pdf.setFont("Helvetica-Bold", 46)
pdf.drawString(50, h - 115, "No. 6 Coffee")
pdf.setFont("Helvetica", 15); pdf.drawString(52, h - 145, "Cafe. Coffee. Something good to eat.")
pdf.setStrokeColor(green); pdf.setLineWidth(.65); pdf.line(52, h - 175, w - 52, h - 175)
y = h - 218
for i, service in enumerate(content["services"]):
    if i in (0, 2):
        if i: y -= 14
        pdf.setFillColor(green); pdf.setFont("Helvetica-Bold", 10)
        pdf.drawString(52, y, "COFFEE" if i == 0 else "FROM THE KITCHEN")
        y -= 32
    pdf.setFillColor(ink); pdf.setFont("Helvetica-Bold", 21)
    pdf.drawString(52, y, service["name"])
    pdf.setFont("Helvetica", 14)
    pdf.drawRightString(w - 52, y + 1, f"£{service['priceMinor']/100:.2f}")
    pdf.setFont("Helvetica", 10.5)
    pdf.drawString(52, y - 19, service.get("description", ""))
    y -= 66
pdf.setStrokeColor(green); pdf.line(52, 138, w - 52, 138)
pdf.setFillColor(green); pdf.setFont("Times-Italic", 17)
pdf.drawString(52, 109, "Coffee and breakfast.")
pdf.setFillColor(ink); pdf.setFont("Helvetica", 9)
pdf.drawString(52, 78, "Menu design example · Taplo")
pdf.drawString(52, 64, "This file demonstrates a downloadable menu. It takes no orders or payments.")
pdf.save()
print(target)
