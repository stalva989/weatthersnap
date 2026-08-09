type Props = {
  address: string;
  dateOfLoss: string;
  searchWindowStart: string;
  searchWindowEnd: string;
};

export default function PropertySection({
  address,
  dateOfLoss,
  searchWindowStart,
  searchWindowEnd,
}: Props) {
  return (
    <div className="mt-8 rounded-xl border border-slate-300 bg-white">

      <div className="grid grid-cols-3 divide-x">

        <div className="p-6">

          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Property
          </div>

          <div className="mt-3 text-base leading-6 text-slate-900">
            {address}
          </div>

        </div>

        <div className="p-6">

          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Date of Loss
          </div>

          <div className="mt-3 text-lg font-semibold text-slate-900">
            {dateOfLoss}
          </div>

        </div>

        <div className="p-6">

          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Search Window
          </div>

          <div className="mt-3 text-base leading-6 text-slate-900">
            {searchWindowStart}
            <br />
            to
            <br />
            {searchWindowEnd}
          </div>

        </div>

      </div>

    </div>
  );
}