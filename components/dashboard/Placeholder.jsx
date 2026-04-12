export default function Placeholder({ title, children }) {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold tracking-tight text-sky-950 dark:text-sky-50">
        {title}
      </h1>
      {children ? (
        <p className="max-w-2xl text-sky-800/85 dark:text-sky-200/80">
          {children}
        </p>
      ) : null}
    </div>
  );
}
