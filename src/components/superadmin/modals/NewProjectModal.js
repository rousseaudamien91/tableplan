/* eslint-disable */
import { Field, Input, Select, Btn } from "../../components/UI";
import { THEMES_CONFIG } from "../../constants";

export default function NewProjectModal({
  open,
  onClose,
  newProject,
  setNewProject,
  users,
  createProject
}) {
  if (!open) return null;

  return (
    <div style={{
      background:"#0008",
      position:"fixed",
      inset:0,
      display:"flex",
      alignItems:"center",
      justifyContent:"center",
      zIndex:9999
    }}>
      <div style={{
        width:500,
        background:"#18182a",
        borderRadius:12,
        padding:24,
        border:"1px solid rgba(255,255,255,0.1)"
      }}>
        <h3 style={{margin:"0 0 16px",fontSize:18,fontWeight:700}}>
          Créer un nouveau projet
        </h3>

        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <Field label="NOM *">
            <Input
              value={newProject.name}
              onChange={e => setNewProject({...newProject, name:e.target.value})}
              placeholder="Mariage Dupont × Martin"
            />
          </Field>

          <Field label="DATE">
            <Input
              type="date"
              value={newProject.date}
              onChange={e => setNewProject({...newProject, date:e.target.value})}
            />
          </Field>

          <Field label="TYPE">
            <Select
              value={newProject.type}
              onChange={e => setNewProject({...newProject, type:e.target.value})}
            >
              {Object.entries(THEMES_CONFIG).map(([k,v]) => (
                <option key={k} value={k}>{v.icon} {v.label}</option>
              ))}
            </Select>
          </Field>

          <Field label="ADMIN">
            <Select
              value={newProject.adminId}
              onChange={e => setNewProject({...newProject, adminId:e.target.value})}
            >
              <option value="">— Sans propriétaire —</option>
              {users.filter(u => u.role === "admin").map(u => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </Select>
          </Field>

          <Btn onClick={createProject}>Créer</Btn>
        </div>
      </div>
    </div>
  );
}
