import { useProducts } from '../context/ProductContext'

const SORTS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'rating', label: 'Top Rated' }
]

export default function FilterBar() {
  const { filters, setFilter, resetFilters, filtered, products } = useProducts()

  return (
    <div className="filter-bar">
      <div className="filter-bar-inner">
        <div className="filter-group">
          <label className="filter-label">Sort</label>
          <select
            value={filters.sort}
            onChange={e => setFilter({ sort: e.target.value })}
            className="filter-select"
          >
            {SORTS.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        <div className="filter-group filter-price">
          <label className="filter-label">
            Price: ${filters.minPrice} – ${filters.maxPrice}
          </label>
          <div className="range-wrap">
            <input
              type="range" min="0" max="500" step="10"
              value={filters.maxPrice}
              onChange={e => setFilter({ maxPrice: Number(e.target.value) })}
              className="range-input"
            />
          </div>
        </div>

        <div className="filter-results">
          <span>{filtered.length} of {products.length} products</span>
        </div>

        {(filters.category !== 'all' || filters.maxPrice !== 500 || filters.search) && (
          <button className="reset-btn" onClick={resetFilters}>
            Clear filters ×
          </button>
        )}
      </div>
    </div>
  )
}
