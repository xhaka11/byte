type Spec = { label: string; value: string };

export function SetupCard({
  category,
  name,
  image,
  specs,
  extra,
}: {
  category: string;
  name: string;
  image: string;
  specs: readonly Spec[];
  extra?: readonly Spec[];
}) {
  return (
    <div className="panel panel-hover group grain flex h-full flex-col p-5">
      <div className="label-hud text-primary">{category}</div>

      <div className="relative my-4 grid h-44 place-items-center overflow-hidden rounded-lg bg-white/5 sm:h-36">
        <div className="absolute inset-0 rounded-full bg-primary/0 blur-2xl transition-colors duration-500 group-hover:bg-primary/15" />
        <img
          src={image}
          alt={name}
          loading="lazy"
          width={768}
          height={768}
          className="relative h-32 w-auto object-contain transition-transform duration-500 group-hover:scale-110 sm:h-full"
        />
      </div>

      <h3 className="text-display text-base font-bold leading-tight">{name}</h3>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        {specs.map((s) => (
          <div key={s.label}>
            <dt className="label-hud truncate">{s.label}</dt>
            <dd className="text-display font-bold">{s.value}</dd>
          </div>
        ))}
      </dl>

      {extra && extra.length > 0 && (
        <dl className="mt-3 grid max-h-0 grid-cols-2 gap-3 overflow-hidden text-sm opacity-0 transition-all duration-500 group-hover:max-h-32 group-hover:opacity-100">
          {extra.map((s) => (
            <div key={s.label}>
              <dt className="label-hud truncate">{s.label}</dt>
              <dd className="text-display font-bold text-primary">{s.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
