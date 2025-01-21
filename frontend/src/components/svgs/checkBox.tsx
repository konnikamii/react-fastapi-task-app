 
const CheckBox = (props: React.SVGProps<SVGSVGElement>) => {
  return (      
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" {...props}>  
    <rect x="5" y="5" width="22" height="22" rx="2" stroke="none"/>
    <path d="M5.5 17.5L13.5 24.5L26.5 7" fill="none" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg> 
  );
};
export default CheckBox;
