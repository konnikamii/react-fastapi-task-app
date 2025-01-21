 
const Info  = (props: React.SVGProps<SVGSVGElement>) => {
  return (   
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" {...props}> 
    <circle cx="16" cy="16" r="13" fill="none" strokeWidth="2.5"/>
    <path d="M16 15V22" fill="none" strokeWidth="3" strokeLinecap="round"/>
    <circle cx="16" cy="10.5" r="1.5" stroke="none"/>
    </svg>   
  );
};
export default Info;
