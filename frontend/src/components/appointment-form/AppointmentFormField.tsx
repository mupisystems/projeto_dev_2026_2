import type { ReactNode } from 'react';

interface AppointmentFormFieldProps {
  id?: string;
  label: string;
  obrigatorio?: boolean;
  icone: ReactNode;
  erro?: string;
  className?: string;
  children: ReactNode;
}

export function AppointmentFormField({
  id,
  label,
  obrigatorio = false,
  icone,
  erro,
  className = 'space-y-1.5',
  children,
}: AppointmentFormFieldProps): ReactNode {
  return (
    <div className={className}>
      <label htmlFor={id} className="flex items-center gap-1.5 text-sm font-bold text-primary">
        <span className="text-accent">{icone}</span>
        {label} {obrigatorio && <span className="text-danger">*</span>}
      </label>
      {children}
      {erro && <p className="text-xs font-semibold text-danger">{erro}</p>}
    </div>
  );
}
