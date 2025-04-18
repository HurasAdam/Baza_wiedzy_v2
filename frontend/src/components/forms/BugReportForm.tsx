import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-hot-toast";
import { Bug, Upload } from "lucide-react";

interface BugReportData {
  title: string;
  description: string;
  category: string;
  steps: string;
  file?: File | null;
}

const BugReportForm = () => {
  const [form, setForm] = useState<BugReportData>({
    title: "",
    description: "",
    category: "",
    steps: "",
    file: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      file: e.target.files?.[0] || null,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description) {
      toast.error("Tytuł i opis są wymagane");
      return;
    }

    setIsSubmitting(true);

    // Tu możesz wysłać dane do API lub np. na Slacka
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Dziękujemy za zgłoszenie!");
      setForm({
        title: "",
        description: "",
        category: "",
        steps: "",
        file: null,
      });
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 w-full h-full mx-auto p-6 border rounded-lg bg-background">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Bug className="text-red-500" /> Zgłoś błąd
      </h2>

      <div>
        <label className="font-medium block mb-1">Tytuł błędu *</label>
        <Input
          name="title"
          placeholder="Np. Nie działa przycisk zapisz"
          value={form.title}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label className="font-medium block mb-1">Opis błędu *</label>
        <Textarea
          name="description"
          placeholder="Co dokładnie się dzieje? Jakiego zachowania się spodziewasz?"
          rows={4}
          value={form.description}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label className="font-medium block mb-1">Kategoria błędu</label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full p-2 border rounded-md text-sm bg-background"
        >
          <option value="">Wybierz kategorię</option>
          <option value="ui">Interfejs (UI)</option>
          <option value="performance">Wydajność</option>
          <option value="backend">Backend</option>
          <option value="other">Inne</option>
        </select>
      </div>

      <div>
        <label className="font-medium block mb-1">Jak odtworzyć błąd?</label>
        <Textarea
          name="steps"
          placeholder="Opisz krok po kroku jak wywołać błąd"
          rows={3}
          value={form.steps}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="font-medium block mb-1">Załącz zrzut ekranu (opcjonalnie)</label>
        <label className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground">
          <Upload size={16} />
          <span>{form.file?.name || "Wybierz plik"}</span>
          <input type="file" accept="image/*" onChange={handleFileChange} hidden />
        </label>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Wysyłanie..." : "Zgłoś błąd"}
      </Button>
    </form>
  );
};

export default BugReportForm;
