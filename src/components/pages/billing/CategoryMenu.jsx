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
  <div className="bill-category-menu flex flex-col gap-3 rounded-xl bg-white px-2.5 py-[14px] shadow-[0_8px_24px_rgba(17,24,39,0.04)] [grid-area:items-menu] max-[1200px]:grid max-[1200px]:grid-cols-[repeat(auto-fit,minmax(100px,1fr))]">
    {categories.map(([category, icon, label]) => {
      const isActive = selected === category;

      return (
        <div
          className={`bill-category flex min-h-[52px] w-full cursor-pointer items-center gap-[13px] rounded-lg px-4 transition-all duration-300 ease-in-out hover:scale-[1.03] hover:bg-[#e1e1eb] ${
            isActive
              ? "bill-category-active bg-[linear-gradient(135deg,#5b36ff,#7705c3)] shadow-[0_8px_18px_rgba(91,54,255,0.28)]"
              : ""
          }`}
          key={category}
          onClick={() => onSelect(category)}
        >
          <img
            className={`h-5 w-5 shrink-0 object-contain ${
              isActive ? "[filter:brightness(0)_invert(1)]" : ""
            }`}
            src={`/assets/${icon}`}
            alt=""
          />
          <span
            className={`text-[11px] font-semibold leading-[1.25] max-[1200px]:text-[10px] ${
              isActive ? "text-white" : "text-[#111340]"
            }`}
          >
            {label}
          </span>
        </div>
      );
    })}
  </div>
);

export default CategoryMenu;
