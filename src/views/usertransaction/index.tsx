import ReservationForm from "./components/reservationForm";

export default function ReservationView() {
  return (
    <div className="flex flex-col gap-10">
      <h1 className="text-3xl">RESERVATION</h1>
      <ReservationForm />
    </div>
  )
};