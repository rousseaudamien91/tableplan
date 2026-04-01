/* eslint-disable */
import { Field, Input, Select, Btn } from "../../UI";
import { SUBSCRIPTION_PLANS } from "../../../constants";

export default function NewUserModal({ open, onClose, newUser, setNewUser, createUser }) {
  if (!open) return null;
  return (
    <div style={{ background:"#0008", position:"fixed", inset:0, display:"flex", alignItems:"center", justifyContent:"center", zIndex:9999 }}>
      <div style={{ width:500, background:"#18182a", borderRadius:12, padding:24, border:"1px solid rgba(255,255,255,0.1)" }}>
        <h3 style={{ margin:"0 0 16px", fontSize:18, fontWeight:700 }}>
          Créer un compte admin
        </h3>
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <Field label="NOM *">
            <Input
              value={newUser.name}
              onChange={e => setNewUser({ ...newUser, name: e.target.value })}
              placeholder="Marie Dupont"
            />
          </Field>
          <Field label="EMAIL *">
            <Input
              type="email"
              value={newUser.email}
              onChange={e => setNewUser({ ...newUser, email: e.target.value })}
              placeholder="marie@example.fr"
            />
          </Field>
          <Field label="PLAN">
            <Select
              value={newUser.plan}
              onChange={e => setNewUser({ ...newUser, plan: e.target.value })}
            >
              {Object.entries(SUBSCRIPTION_PLANS).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </Select>
          </Field>
          <Field label="STATUT">
            <Select
              value={newUser.subscriptionStatus}
              onChange={e => setNewUser({ ...newUser, subscriptionStatus: e.target.value })}
            >
              <option value="trial">Essai</option>
              <option value="active">Actif</option>
            </Select>
          </Field>
          <Btn onClick={createUser}>Créer le compte</Btn>
        </div>
      </div>
    </div>
  );
}
