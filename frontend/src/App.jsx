import { Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import api from './api/client';

const modules = ['uml', 'laravel', 'react', 'pie', 'english', 'french', 'approche agile'];
const scoreFields = ['controle_1', 'controle_2', 'controle_3', 'efm', 'regional'];

function Home() {
  return (
    <div className="page">
      <img className="logo" src="/assets/logo.png" alt="OFPPT" />
      <h1>OFPPT Notes</h1>
      <p>Choisissez votre profil</p>
      <div className="grid">
        <Link to="/student/login" className="card">Stagiaires Full Stack (DEV201/DEV202)</Link>
        <div className="card muted">Stagiaires Tronc Commun - Coming soon</div>
        <Link to="/teacher/login" className="card">Formateurs</Link>
        <Link to="/developers" className="card">Développeurs</Link>
      </div>
    </div>
  );
}

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', phone: '', group_name: 'DEV201', password: '', password_confirmation: '' });
  const [error, setError] = useState('');

  const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      await api.post('/auth/register', form);
      navigate('/student/login');
    } catch (err) {
      setError(err?.response?.data?.message ?? 'Erreur inscription');
    }
  };

  return (
    <AuthCard title="Register Stagiaire Full Stack">
      {error && <p className="error">{error}</p>}
      <form onSubmit={submit}>
        <input placeholder="Nom" value={form.first_name} onChange={(e) => updateField('first_name', e.target.value)} required />
        <input placeholder="Prénom" value={form.last_name} onChange={(e) => updateField('last_name', e.target.value)} required />
        <input type="email" placeholder="Gmail" value={form.email} onChange={(e) => updateField('email', e.target.value)} required />
        <input placeholder="Téléphone" value={form.phone} onChange={(e) => updateField('phone', e.target.value)} required />
        <select value={form.group_name} onChange={(e) => updateField('group_name', e.target.value)}>
          <option value="DEV201">DEV201</option>
          <option value="DEV202">DEV202</option>
        </select>
        <input type="password" placeholder="Password" value={form.password} onChange={(e) => updateField('password', e.target.value)} required />
        <input type="password" placeholder="Confirm password" value={form.password_confirmation} onChange={(e) => updateField('password_confirmation', e.target.value)} required />
        <button type="submit">Register</button>
      </form>
      <Link to="/student/login">Login</Link>
    </AuthCard>
  );
}

function LoginForm({ mode = 'student' }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const { data } = await api.post('/auth/login', { email, password, expected_role: mode === 'teacher' ? 'teacher' : 'student' });
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.user.role);
      localStorage.setItem('user', JSON.stringify(data.user));

      if (data.user.role === 'teacher') {
        navigate('/teacher/dashboard');
        return;
      }

      navigate('/student/dashboard');
    } catch (err) {
      setError(err?.response?.data?.message ?? 'incorrect');
    }
  };

  return (
    <AuthCard title={mode === 'teacher' ? 'Login - Formateurs' : 'Login - Stagiaires Full Stack'}>
      {error && <p className="error">{error}</p>}
      <form onSubmit={submit}>
        <input type="email" placeholder="gmail" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Se connecter</button>
      </form>
      {mode === 'student' && (
        <>
          <Link to="/student/forgot">I forget my password</Link> | <Link to="/student/register">Register</Link>
        </>
      )}
    </AuthCard>
  );
}

function ForgotPassword() {
  const [validatedEmail, setValidatedEmail] = useState('');
  const [form, setForm] = useState({ first_name: '', last_name: '', phone: '', email: '' });
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const checkIdentity = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/auth/forgot-password', form);
      setValidatedEmail(data.reset_email);
    } catch (err) {
      setError(err?.response?.data?.message ?? 'Informations non valides.');
    }
  };

  const reset = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await api.post('/auth/reset-password', { email: validatedEmail, password, password_confirmation: confirm });
      setMessage('Password updated, please login.');
    } catch (err) {
      setError(err?.response?.data?.message ?? 'Reset failed.');
    }
  };

  return (
    <AuthCard title="Forgot password">
      {error && <p className="error">{error}</p>}
      {!validatedEmail ? (
        <form onSubmit={checkIdentity}>
          <input placeholder="Nom" onChange={(e) => setForm((prev) => ({ ...prev, first_name: e.target.value }))} required />
          <input placeholder="Prénom" onChange={(e) => setForm((prev) => ({ ...prev, last_name: e.target.value }))} required />
          <input placeholder="Téléphone" onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))} required />
          <input type="email" placeholder="Gmail" onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} required />
          <button type="submit">Valider identité</button>
        </form>
      ) : (
        <form onSubmit={reset}>
          <input type="password" placeholder="New password" onChange={(e) => setPassword(e.target.value)} required />
          <input type="password" placeholder="Confirm password" onChange={(e) => setConfirm(e.target.value)} required />
          <button type="submit">Reset password</button>
        </form>
      )}
      {message && <p className="success">{message}</p>}
    </AuthCard>
  );
}

function StudentDashboard() {
  const [grades, setGrades] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    let mounted = true;

    Promise.all([api.get('/student/grades'), api.get('/student/notifications')]).then(([gradesRes, notifRes]) => {
      if (!mounted) return;
      setGrades(gradesRes.data);
      setNotifications(notifRes.data);
    });

    return () => {
      mounted = false;
    };
  }, []);

  const gradesByModule = useMemo(() => {
    const map = new Map();
    grades.forEach((entry) => map.set(entry.module_name, entry));
    return map;
  }, [grades]);

  return (
    <div className="page">
      <h2>Profil stagiaire</h2>
      <div className="grid2">
        {modules.map((module) => {
          const score = gradesByModule.get(module);
          return (
            <div className="card" key={module}>
              <h4>{module.toUpperCase()}</h4>
              {score ? (
                <ul className="score-list">
                  {scoreFields.map((field) => (
                    <li key={field}>{field}: {score[field] ?? '-'}</li>
                  ))}
                </ul>
              ) : (
                <p>Pas encore de notes</p>
              )}
            </div>
          );
        })}
      </div>
      <h3>Notifications</h3>
      {notifications.length === 0 && <p>Aucune notification pour le moment.</p>}
      {notifications.map((notification) => (
        <div key={notification.id} className="card left">
          <b>{notification.title}</b>
          <p>{notification.message}</p>
          <small>Module: {notification.module_name}</small>
        </div>
      ))}
    </div>
  );
}

function TeacherDashboard() {
  const [group, setGroup] = useState('DEV201');
  const [students, setStudents] = useState([]);
  const [status, setStatus] = useState('');
  const [resourceStatus, setResourceStatus] = useState('');
  const [grade, setGrade] = useState({ student_id: '', module_name: 'react', controle_1: '', controle_2: '', controle_3: '', efm: '', regional: '' });

  const load = async () => {
    const { data } = await api.get('/teacher/students', { params: { group_name: group } });
    setStudents(data);
  };

  const save = async (event) => {
    event.preventDefault();
    await api.post('/teacher/grades', grade);
    setStatus('Note enregistrée.');
  };

  return (
    <div className="page">
      <h2>Espace Formateur ({group})</h2>
      <div className="inline-controls">
        <select value={group} onChange={(e) => setGroup(e.target.value)}>
          <option value="DEV201">DEV201</option>
          <option value="DEV202">DEV202</option>
        </select>
        <button type="button" onClick={load}>Charger les stagiaires</button>
      </div>

      <div className="card left">
        <h3>Stagiaires du groupe</h3>
        {students.length === 0 && <p>Aucun stagiaire chargé.</p>}
        {students.map((student) => <p key={student.id}>{student.id} - {student.first_name} {student.last_name}</p>)}
      </div>

      <form onSubmit={save} className="auth-card">
        <h3>Saisie des notes</h3>
        <input placeholder="Student ID" value={grade.student_id} onChange={(e) => setGrade((prev) => ({ ...prev, student_id: e.target.value }))} required />
        <select value={grade.module_name} onChange={(e) => setGrade((prev) => ({ ...prev, module_name: e.target.value }))}>
          {modules.map((module) => <option key={module} value={module}>{module}</option>)}
        </select>
        {scoreFields.map((field) => (
          <input key={field} type="number" min="0" max="20" step="0.01" placeholder={field} value={grade[field]} onChange={(e) => setGrade((prev) => ({ ...prev, [field]: e.target.value }))} />
        ))}
        <button type="submit">Save grade</button>
        {status && <p className="success">{status}</p>}
      </form>

      <UploadResource onSuccess={setResourceStatus} />
      {resourceStatus && <p className="success">{resourceStatus}</p>}
    </div>
  );
}

function UploadResource({ onSuccess }) {
  const [groupName, setGroupName] = useState('DEV201');
  const [moduleName, setModuleName] = useState('react');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);

  const send = async (event) => {
    event.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('group_name', groupName);
    formData.append('module_name', moduleName);
    formData.append('title', title);
    formData.append('message', message);
    formData.append('file', file);

    await api.post('/teacher/resources', formData);
    onSuccess('Ressource envoyée au groupe.');
    setTitle('');
    setMessage('');
  };

  return (
    <form onSubmit={send} className="auth-card">
      <h3>Upload cours (pdf/image)</h3>
      <select value={groupName} onChange={(e) => setGroupName(e.target.value)}>
        <option value="DEV201">DEV201</option>
        <option value="DEV202">DEV202</option>
      </select>
      <select value={moduleName} onChange={(e) => setModuleName(e.target.value)}>
        {modules.map((module) => <option key={module} value={module}>{module}</option>)}
      </select>
      <input placeholder="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <textarea placeholder="message" value={message} onChange={(e) => setMessage(e.target.value)} />
      <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => setFile(e.target.files?.[0] ?? null)} required />
      <button type="submit">Envoyer</button>
    </form>
  );
}

function Developers() {
  return (
    <div className="page">
      <h1>Contactez les développeurs</h1>
      <div className="grid">
        <div className="card">
          <img className="avatar" src="/assets/azzedine.jpg" alt="Azzedine Oubaid" />
          <h3>Azzedine Oubaid</h3>
          <p>Développeur Full Stack</p>
        </div>
        <div className="card">
          <img className="avatar" src="/assets/loubna.jpg" alt="Loubna Azmam" />
          <h3>Loubna Azmam</h3>
          <p>Développeuse Full Stack</p>
        </div>
      </div>
    </div>
  );
}

function AuthCard({ title, children }) {
  return (
    <div className="page">
      <div className="auth-card">
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/student/register" element={<Register />} />
      <Route path="/student/login" element={<LoginForm mode="student" />} />
      <Route path="/student/forgot" element={<ForgotPassword />} />
      <Route path="/student/dashboard" element={<StudentDashboard />} />
      <Route path="/teacher/login" element={<LoginForm mode="teacher" />} />
      <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
      <Route path="/developers" element={<Developers />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
