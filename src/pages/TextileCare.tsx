import { Droplet, Sun, Shirt, Wind } from "lucide-react";

export default function TextileCare() {
  const careTips = [
    {
      icon: Droplet,
      title: "Washing",
      tips: [
        "Always check the care label before washing",
        "Use cold or warm water (not hot)",
        "Use mild, eco-friendly detergents",
        "Wash similar colors together",
        "Avoid overloading the washing machine",
      ],
    },
    {
      icon: Sun,
      title: "Drying",
      tips: [
        "Air dry when possible to preserve fabric quality",
        "Avoid direct sunlight for colored fabrics",
        "Use low heat settings if using a dryer",
        "Remove promptly to prevent wrinkles",
        "Hang or lay flat to maintain shape",
      ],
    },
    {
      icon: Shirt,
      title: "Ironing",
      tips: [
        "Check fabric care label for temperature settings",
        "Use steam for stubborn wrinkles",
        "Iron on the reverse side for delicate fabrics",
        "Never iron directly on prints or embroidery",
        "Let fabric cool before storing",
      ],
    },
    {
      icon: Wind,
      title: "Storage",
      tips: [
        "Store in a cool, dry place",
        "Use breathable storage containers",
        "Avoid plastic bags for long-term storage",
        "Fold properly to prevent creasing",
        "Keep away from direct sunlight",
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto container-padding py-16">
      <div className="text-center mb-20">
        <h1 className="heading-medium mb-6">How to Care for Your Textiles</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Proper care ensures your textiles stay beautiful and last longer.
          Follow these guidelines to maintain the quality of your purchases.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {careTips.map((section, index) => {
          const Icon = section.icon;
          return (
            <div key={index} className="card-hover">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-primary-100 rounded-xl shadow-soft">
                  <Icon className="h-7 w-7 text-primary-600" />
                </div>
                <h2 className="text-2xl font-medium">{section.title}</h2>
              </div>
              <ul className="space-y-3">
                {section.tips.map((tip, tipIndex) => (
                  <li key={tipIndex} className="flex items-start gap-3">
                    <span className="text-primary-600 mt-1.5 font-bold">•</span>
                    <span className="text-gray-700 leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="card bg-gradient-to-br from-primary-50 to-primary-100 border-2 border-primary-200">
        <h2 className="text-2xl font-medium mb-6">General Care Guidelines</h2>
        <div className="space-y-4 text-gray-700 leading-relaxed">
          <p className="text-lg">
            <strong className="text-primary-700">Read the Label:</strong> Always
            check the care label on your textiles. It contains specific
            instructions for that particular fabric.
          </p>
          <p className="text-lg">
            <strong className="text-primary-700">Sort by Color:</strong>{" "}
            Separate whites, lights, and darks to prevent color bleeding.
          </p>
          <p className="text-lg">
            <strong className="text-primary-700">Use Gentle Cycles:</strong> For
            delicate fabrics, use the gentle or delicate cycle on your washing
            machine.
          </p>
          <p className="text-lg">
            <strong className="text-primary-700">Avoid Harsh Chemicals:</strong>{" "}
            Use mild detergents and avoid bleach unless specifically
            recommended.
          </p>
          <p className="text-lg">
            <strong className="text-primary-700">Regular Maintenance:</strong>{" "}
            Regular cleaning and proper storage will extend the life of your
            textiles significantly.
          </p>
        </div>
      </div>
    </div>
  );
}
