 
const User  = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" {...props}>
      <circle
        cx="16"
        cy="12"
        r="4"  
        stroke="none"
      />
      <circle
        cx="16"
        cy="16"
        r="12" 
        strokeWidth="1.5" 
        fill="none"
      />
      <path
        d="M13 18.5C10.5 19 7.5 22 7.5 24.5C7.5 24.5 10.5 28 16 28C21.5 28 24.5 24.5 24.5 24.5C24.5 22 21.5 19 19 18.5C17 20 15 20 13 18.5Z"  
        stroke="none"
      />
    </svg>
  );
};

export default User;