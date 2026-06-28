const categories = [
  ["All Items", "all-items.svg", <>All Items</>],
  ["Beverage", "beverage.svg", <>Beverage</>],
  ["Steamed Bun", "steamed-bun.svg", <>Steamed<br /> Bun</>],
  ["Steamed Timsum", "steamed-timsum.svg", <>Steamed<br /> Timsum</>],
  ["Deep Fry Timsum", "deep-fry-timsum.svg", <>Deep Fry<br /> Timsum</>],
  ["Bake", "bake.svg", <>Bake</>],
  ["Noodle/Dumplings", "noodle-dumplings.svg", <>Noodle/<br /> Dumplings</>],
  ["Porridge", "porridge.svg", <>Porridge</>],
];

const CategoryMenu = ({ selected, onSelect }) => (
  <div className="bill-category-menu">
    {categories.map(([category, icon, label]) => (
      <div
        className={`bill-category ${selected === category ? "bill-category-active" : ""}`}
        key={category}
        onClick={() => onSelect(category)}
      >
        <img src={`/assets/${icon}`} alt="" />
        <span>{label}</span>
      </div>
    ))}
  </div>
);

export default CategoryMenu;
