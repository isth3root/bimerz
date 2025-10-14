import { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import { DatePicker } from "zaman";
import moment from "moment-jalaali";

// Client-only Persian date picker component using zaman
export const ClientOnlyDatePicker = ({
  value,
  onChange,
  placeholder,
  id,
}: {
  value: string;
  onChange: (date: string) => void;
  placeholder: string;
  id?: string;
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Convert Persian numbers to English
  const persianToEnglish = (str: string): string => {
    const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return str.replace(/[۰-۹]/g, (char) => persianNumbers.indexOf(char).toString());
  };

  // Convert Persian date string to Date object
  const parsePersianDate = (dateStr: string): Date | undefined => {
    if (!dateStr) return undefined;
    const englishDateStr = persianToEnglish(dateStr);
    const m = moment(englishDateStr, "jYYYY/jMM/jDD");
    return m.isValid() ? m.toDate() : undefined;
  };

  // Convert Date object to Persian date string
  const formatPersianDate = (date: Date): string => {
    return moment(date).format("jYYYY/jMM/jDD");
  };

  const handleDateChange = (e: { value: Date }) => {
    const persianDate = formatPersianDate(e.value);
    onChange(persianDate);
  };

  if (!isClient) {
    return (
      <div id={id} className="flex items-center gap-2 border rounded-md px-3 py-2 text-sm bg-white">
        <Calendar className="h-4 w-4 text-gray-400" />
        <span>{placeholder}</span>
      </div>
    );
  }

  const parsedDate = parsePersianDate(value);
  return (
    <div id={id}>
      <DatePicker
        defaultValue={parsedDate || undefined}
        onChange={handleDateChange}
        className="w-full"
        inputClass="flex items-center gap-2 border rounded-md px-3 py-2 text-sm bg-white"
        inputAttributes={{
          placeholder: placeholder,
          style: { direction: "rtl" },
          value: value,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value),
        }}
      />
    </div>
  );
};