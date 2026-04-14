export default function Placeholder({ title, children }) {
  return (
    <div className="space-y-2">
      <h1 className="sa-page-title text-2xl font-medium tracking-[-0.03em] text-slate-800 sm:text-[1.65rem]">
        {title}
      </h1>
      {children ? (
        <p className="max-w-2xl text-[15px] leading-relaxed text-slate-600">
          {children}
        </p>
      ) : null}
    </div>
  );
}
