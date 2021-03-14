import { PAGINATION_QUERY } from '../components/Pagination';

export default function paginationField() {
  return {
    keyArgs: false, // tells apollo we will take care of everything
    read(existing = [], { args, cache }) {
      const { skip, first } = args;

      // read the number of items on the page from the cache
      const data = cache.readQuery({ query: PAGINATION_QUERY });
      const count = data?._allProductsMeta?.count;
      const page = skip / first + 1;
      const pages = Math.ceil(count / first);

      // check if we have existing items
      const items = existing.slice(skip, skip + first).filter((x) => x);
      if (items.length && items.length !== first && page === pages) {
        return items;
      }
      if (items.length !== first) {
        // We don't have any items, we must go to the network to fetch them
        return false;
      }

      // if there are items, just return them from the cache,
      // and we dont need to go to the network
      if (items.length) {
        console.log(
          `There are ${items.length} items in the cache! Gonna send them to apollo`
        );
        return items;
      }
      return false; // fallback to network
    },
    merge(existing, incoming, { args }) {
      const { skip, first } = args;
      // this runs when the appolo client comes back from the network with our product
      const merged = existing ? existing.slice(0) : [];

      for (let i = skip; i < skip + incoming.length; ++i) {
        merged[i] = incoming[i - skip];
      }
      // finally return the merged items from the cache
      return merged;
    },
  };
}
