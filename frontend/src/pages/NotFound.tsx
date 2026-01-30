import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
      <h1 className="text-6xl font-heading font-bold text-simpsons-yellow mb-4">
        404
      </h1>
      <p className="text-xl mb-2">&quot;Me fail web? That&apos;s unpossible!&quot;</p>
      <p className="text-[var(--color-text-secondary)] mb-8">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link to="/" className="btn-primary">
        Go Home
      </Link>
    </div>
  );
}
