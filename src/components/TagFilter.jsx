export default function TagFilter({ allTags, activeTags, onToggle, onClearAll }) {
  return (
    <div className="tag-filter-bar">
      {activeTags.size > 0 && (
        <button className="tag-pill tag-pill--clear" onClick={onClearAll}>
          Clear
        </button>
      )}
      {allTags.map(tag => (
        <button
          key={tag}
          className={`tag-pill${activeTags.has(tag) ? ' tag-pill--active' : ''}`}
          onClick={() => onToggle(tag)}
        >
          {tag}
        </button>
      ))}
    </div>
  )
}
