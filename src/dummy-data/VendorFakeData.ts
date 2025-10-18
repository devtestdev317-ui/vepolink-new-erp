
import type { VendorType } from "@/types/VendorType"
export const VedorFakeData: VendorType[] = [
    {
        "vendor_name": "TechSolutions Inc.",
        "address": "123 Innovation Drive",
        "city": "San Francisco",
        "state": "California",
        "status": "active",
        "createdAt": new Date("2024-01-15T10:30:00.000Z"),
        "items": [
            {
                "item_name": "Advanced Chemical Analyzer",
                "specification": "High-precision chemical analysis with 99.9% accuracy, 16-channel detection, real-time monitoring, and automated calibration. Suitable for laboratory and industrial use.",
                "price": 12500.00,
                "delivery_time": "3 weeks",
                "payment_terms": "Net 30",
                "warranty": "2 years comprehensive warranty with onsite support",
                "compliance": "compliant"
            },
            {
                "item_name": "Smart Factory IOT Device",
                "specification": "Industrial IOT sensor with temperature, humidity, and vibration monitoring. Supports LTE/5G connectivity, IP67 rating, and cloud integration with real-time alerts.",
                "price": 450.00,
                "delivery_time": "1 week",
                "payment_terms": "Upfront",
                "warranty": "18 months with remote technical support",
                "compliance": "compliant"
            },
            {
                "item_name": "Multi-Language Translater Pro",
                "specification": "AI-powered translation device supporting 120+ languages with voice recognition, offline mode, and real-time conversation translation. Includes camera-based text translation.",
                "price": 299.99,
                "delivery_time": "2 weeks",
                "payment_terms": "On Delivery",
                "warranty": "1 year limited warranty",
                "compliance": "pending"
            }
        ]
    }
]