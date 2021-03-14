import { useRouter } from 'next/dist/client/router';
import Pagination from '../../components/Pagination';
import Products from '../../components/Products';

export default function ProductsPage() {
  const { query } = useRouter();

  return (
    <div>
      <Pagination page={parseInt(query.page) || 1} />
      <Products page={parseInt(query.page) || 1} />
      <Pagination page={parseInt(query.page) || 1} />
    </div>
  );
}
