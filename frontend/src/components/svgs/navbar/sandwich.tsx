 
const Sandwich  = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" overflow='visible' {...props} > 
      <path className="sandwich-path top" d="M29 9L3 9" strokeWidth="2.5" strokeLinecap="round"/>
      <path className="sandwich-path middle" d="M29 17L3 17" strokeWidth="2.5" strokeLinecap="round"/>
      <path className="sandwich-path bottom" d="M29 25L3 25" strokeWidth="2.5" strokeLinecap="round"/>
    </svg> 
  );
};
export default Sandwich;
