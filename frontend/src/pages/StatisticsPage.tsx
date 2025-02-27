import AButton from "@/components/core/Button"
import { DatePicker } from "@/components/DatePicker"
import { useState } from "react"
import { HiMiniPresentationChartBar } from "react-icons/hi2"
import { IoMdSearch } from "react-icons/io"


export const StatisticsPage = () => {

  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  return (
    <div className="p-5 h-full flex flex-col w-full max-w-[1580px] mx-auto">
      <h2 className="flex items-center gap-2 text-2xl font-bold mb-8 text-foreground">
        <HiMiniPresentationChartBar className="w-8 h-8  text-foreground" />
        Statystyki użytkowników
      </h2>

      {/* Sekcja filtrów */}
      <div className="border bg-background  text-foreground rounded-lg p-6 mb-8 shadow-sm">
        <h3 className="text-lg font-semibold  text-foreground mb-4">Filtruj według zakresu dat</h3>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <DatePicker setState={setStartDate} state={startDate} label="Data początkowa" />
          <DatePicker setState={setEndDate} state={endDate} label="Data końcowa" />
          <AButton

            icon={<IoMdSearch className="w-3.5 h-3.5" />}
            label="Wyszukaj"

            className=""
          >

          </AButton>
          <AButton
            label="   Wyczyść filtry"
            disabled={!startDate && !endDate}

            className="   "
          >

          </AButton>
        </div>
      </div>
    </div>
  )
}
