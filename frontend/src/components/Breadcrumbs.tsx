import { useMatches } from "react-router-dom";
import { GoChevronRight } from "react-icons/go";

export default function Breadcrumbs() {
  const matches = useMatches();

  // Filter out matches that don't have a crumb defined
  const crumbs = matches
    .filter((match) => Boolean(match.handle?.crumb))
    .map((match) => match.handle.crumb());

  return (
    <nav className="breadcrumbs">
      {crumbs.map((crumb, index) => (
        <span key={index} className="breadcrumb-item">
          {crumb}
          {index < crumbs.map.length && (
            <GoChevronRight className="breadcrumb-separator" />
          )}
        </span>
      ))}
    </nav>
  );
};