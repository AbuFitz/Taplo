"""Adapt editorial examples to Taplo BusinessContent inputs; never import into an app."""
from pathlib import Path
import argparse
import json

HERE = Path(__file__).resolve().parent


def adapt(business):
    modes = {"service-area": "service_area", "premises": "premises", "online-and-local": "online"}
    labels = {"detailing": "Car detailing", "barber": "Barbers", "dealer": "Car dealers", "trades": "Home services", "tutor": "Tutoring", "cafe": "Café"}
    content = {
        "identity": {
            "name": business["name"], "slug": business["id"],
            "tagline": business["tagline"], "industryKey": business["industry"],
            "industryLabel": labels[business["industry"]],
        },
        "location": {"mode": modes[business["locationMode"]], "locality": business["locality"], "timezone": "Europe/London"},
        "contacts": {"social": []},
        "about": business.get("intro", business["tagline"]),
        "credentials": [], "hours": [], "services": [], "staff": [],
        "gallery": [], "testimonials": [], "reviewLinks": [], "faqs": [],
        "caseStudies": [], "products": [], "offers": [],
        "booking": {"mode": "contact", "onlineBookingReady": False},
    }
    if business["id"] == "stillwater-detailing":
        content["identity"]["heroImage"] = {
            "src": "/taplo-demo/stillwater-hero.png",
            "alt": "A gloved hand wipes the bonnet of a blue coupe in an illustrative detailing workshop.",
            "width": 1536, "height": 1024, "focal": {"x": 62, "y": 48},
        }
    for order, item in enumerate(business.get("services", [])):
        description = item["description"]
        if item.get("includes"):
            description += " Includes: " + "; ".join(item["includes"]) + "."
        service = {
            "id": item["id"], "name": item["name"], "description": description,
            "group": item["group"], "priceMode": {"exact": "fixed"}.get(item["priceMode"], item["priceMode"]),
            "currency": "GBP", "delivery": [], "bookingMode": "contact", "sortOrder": order,
        }
        if item.get("pricePence") is not None:
            service["priceMinor"] = item["pricePence"]
        if item.get("durationMinutes") is not None:
            service["durationMinutes"] = item["durationMinutes"]
        content["services"].append(service)
    for member in business.get("team", []):
        service_ids = [s["id"] for s in business.get("services", []) if member["id"] in s.get("staffIds", [])]
        content["staff"].append({
            "id": member["id"], "slug": member["id"], "name": member["name"],
            "role": member["role"], "bio": member["bio"], "serviceIds": service_ids or None,
            "credentials": [], "subjects": [], "bookable": False,
        })
    for i, faq in enumerate(business.get("faq", [])):
        content["faqs"].append({"id": f'{business["id"]}-faq-{i+1}', "question": faq["q"], "answer": faq["a"]})
    for item in business.get("products", []):
        product = {
            "id": item["id"], "name": item["name"], "description": item["description"],
            "currency": "GBP", "mode": "enquire", "kind": "product", "availability": item["status"],
        }
        if item.get("pricePence") is not None:
            product["priceMinor"] = item["pricePence"]
        content["products"].append(product)
    for item in business.get("vehicles", []):
        product = {
            "id": item["id"], "name": item["title"], "description": item["description"],
            "currency": "GBP", "mode": "enquire", "kind": "vehicle", "availability": item["status"],
            "facts": [
                {"label": "Year", "value": str(item["year"])},
                {"label": "Mileage", "value": f'{item["mileage"]:,} {item["mileageUnit"]}'},
                {"label": "Fuel", "value": item["fuel"]},
                {"label": "Gearbox", "value": item["transmission"]},
            ],
        }
        if item.get("pricePence") is not None:
            product["priceMinor"] = item["pricePence"]
        content["products"].append(product)
    return content


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, default=HERE / "businesses.json")
    parser.add_argument("--output", type=Path, default=HERE / "business-content-inputs.json")
    args = parser.parse_args()
    source = json.loads(args.source.read_text())
    assert source.get("fictional") is True, "Only fictional editorial content is supported"
    results = {business["id"]: adapt(business) for business in source["businesses"]}
    args.output.write_text(json.dumps(results, ensure_ascii=False, indent=2) + "\n")
    print(f"Prepared {len(results)} fictional BusinessContent inputs; no application data changed.")


if __name__ == "__main__":
    main()
