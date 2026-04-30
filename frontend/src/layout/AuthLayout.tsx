import { Dumbbell } from "lucide-react"

type Props = {
    title: string;
    subtitle: string;
    children: React.ReactNode;
}

export default function AuthLayout  ({ children,title, subtitle }: Props)  {
  return (
    <div className="min-h-svh flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md"> 
        {/* Card */}
        <div className="rounded-2xl bg-card shadow-2xl border border-border/60 px-8 py-10">
          {/* Logo + Heading */}
          <div className="text-center mb-10">
            <div className="inline-flex p-4 items-center justify-center
                            rounded-xl bg-primary mb-4 shadow-md">
              <Dumbbell size={36} color="white" strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {title}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          </div>
  
          {/* Form slot */}
          {children}
 
       </div>
      </div> 
    </div>
  )
};

