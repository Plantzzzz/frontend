// TutorialModal.tsx
import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, X } from "lucide-react";

const steps = [
  {
    image: "/tutorial/tutorial1.png",
    title: "Space Creation",
    description: "To create a \"space\" we give it a name and press +Add button. To view the space we press View button under the space we just created"
  },
  {
    image: "/tutorial/tutorial2.png",
    title: "Setting up the grid",
    description: "To change the size of the grid we press the \"set grid\" button."
  },
  {
    image: "/tutorial/tutorial3.png",
    title: "Setting up the grid",
    description: "We are prompted with a imput form where we are able to add any number of rows or columns on any side of the grid and a map to select location of our space. When we are happy with changes we press apply."
  },
  {
    image: "/tutorial/tutorial14.png",
    title: "Editing the space",
    description: "We provide the ability to mark each grid cell as either inside or outside a defined area. This is done by clicking the \"Inside / Outside\" button and using the mouse to highlight the appropriate cells. If a mistake is made, it can easily be corrected using the \"Eraser\" tool."
  },
  {
    image: "/tutorial/tutorial5.png",
    title: "Editing the space",
    description: "To add plants to the grid, click the \"Add Plant\" button."
  },
  {
    image: "/tutorial/tutorial6.png",
    title: "Editing the space",
    description: "To enable watering reminders for your plants, simply click the corresponding button. The reminder system will notify you when it's time to water and will intelligently skip rainy days."
  },
  {
    image: "/tutorial/tutorial7.png",
    title: "Editing the space",
    description: "Once you're satisfied with your grid layout, click the \"Save Table\" button to save your changes."
  },
];

export default function TutorialModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem("seen_tutorial");
    if (!hasSeenTutorial) {
      setIsOpen(true);
      localStorage.setItem("seen_tutorial", "true");
    }
  }, []);

  const next = () => setStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prev = () => setStep((prev) => Math.max(prev - 1, 0));

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="fixed z-50 inset-0">
          <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.3 }}
              className="relative bg-gray-900 text-white rounded-2xl shadow-2xl max-w-lg w-full p-6 flex flex-col items-center gap-4"
            >
              <button
                className="absolute top-3 right-3 text-white hover:text-red-400"
                onClick={() => setIsOpen(false)}
              >
                <X size={20} />
              </button>

              <img
                src={steps[step].image}
                alt={`Step ${step + 1}`}
                className="rounded-xl border border-gray-700 w-full"
              />

              <h2 className="text-xl font-semibold text-center">{steps[step].title}</h2>
              <p className="text-sm text-gray-300 text-center">{steps[step].description}</p>

              <div className="flex items-center justify-between w-full mt-4">
                <button
                  onClick={prev}
                  disabled={step === 0}
                  className="flex items-center gap-1 text-sm px-4 py-2 bg-gray-700 rounded-xl hover:bg-gray-600 disabled:opacity-30"
                >
                  <ChevronLeft size={16} /> Nazaj
                </button>

                <span className="text-sm text-gray-400">
                  Step {step + 1} / {steps.length}
                </span>

                <button
                  onClick={next}
                  disabled={step === steps.length - 1}
                  className="flex items-center gap-1 text-sm px-4 py-2 bg-blue-600 rounded-xl hover:bg-blue-500 disabled:opacity-30"
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </motion.div>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
