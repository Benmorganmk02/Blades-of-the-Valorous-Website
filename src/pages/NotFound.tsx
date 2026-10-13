import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';

export default function NotFound() {
  return (
    <PageHeader eyebrow="Lost in the dark" title="Page Not Found">
      <p>This path leads nowhere.</p>
      <Link to="/" className="btn-ghost mt-8">Return Home</Link>
    </PageHeader>
  );
}
