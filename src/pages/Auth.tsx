import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = isLogin 
      ? await signIn(email, password)
      : await signUp(email, password);

    if (error) {
      toast.error(error.message);
    } else if (!isLogin) {
      toast.success('Cuenta creada. Revisa tu email para confirmar.');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-lagrange-dark flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-lagrange-darker border border-lagrange-border rounded-lg p-8">
          <h1 className="text-2xl font-bold text-lagrange-text mb-2 text-center">
            Sistema Lagrange
          </h1>
          <p className="text-lagrange-muted text-center mb-6">
            {isLogin ? 'Accede a tu cuenta' : 'Crea una nueva cuenta'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-lagrange-dark border-lagrange-border text-lagrange-text"
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="bg-lagrange-dark border-lagrange-border text-lagrange-text"
              />
            </div>
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-lagrange-miedo hover:bg-lagrange-miedo/80"
            >
              {loading ? 'Cargando...' : isLogin ? 'Entrar' : 'Registrarse'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-lagrange-muted hover:text-lagrange-text text-sm"
            >
              {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
