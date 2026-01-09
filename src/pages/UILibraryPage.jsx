import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import TextInput from '../components/TextInput';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Divider from '../components/Divider';
import IconButton from '../components/IconButton';
import Label from '../components/Label';
import ErrorText from '../components/ErrorText';
import DateInput from '../components/DateInput';
import TimeInput from '../components/TimeInput';
import SelectInput from '../components/SelectInput';
import CheckBoxInput from '../components/CheckBoxInput';
import RadioInput from '../components/RadioInput';
import PageTitle from '../components/PageTitle';
import SectionTitle from '../components/SectionTitle';
import ExampleBlock from '../components/ExampleBlock';

import { Plus, Trash } from 'lucide-react';

const UILibraryPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="mx-auto max-w-5xl space-y-16">
        <PageTitle>Biblioteca de UI</PageTitle>

        {/* ================= Buttons ================= */}
        <section className="rounded-2xl border-gray-200 bg-white p-8 shadow-sm space-y-8">
          <SectionTitle>Botones</SectionTitle>

          <ExampleBlock
            title="Primary / Secondary"
            code={`<PrimaryButton>Primary</PrimaryButton>
<SecondaryButton>Secondary</SecondaryButton>`}
          >
            <div className="flex gap-4 flex-wrap">
              <PrimaryButton>Primary</PrimaryButton>
              <SecondaryButton>Secondary</SecondaryButton>
            </div>
          </ExampleBlock>

          <ExampleBlock
            title="Disabled"
            code={`<PrimaryButton disabled>
  Disabled
</PrimaryButton>`}
          >
            <PrimaryButton disabled>Disabled</PrimaryButton>
          </ExampleBlock>
        </section>

        {/* ================= Inputs ================= */}
        <section className="rounded-2xl border-gray-200 bg-white p-8 shadow-sm space-y-8">
          <SectionTitle>Inputs</SectionTitle>

          <div className="grid md:grid-cols-2 gap-8">
            <ExampleBlock
              title="Text Input"
              code={`<Label>Nombre</Label>
<TextInput placeholder="Juan Pérez" />`}
            >
              <div className="space-y-2">
                <Label>Nombre</Label>
                <TextInput placeholder="Juan Pérez" />
              </div>
            </ExampleBlock>

            <ExampleBlock
              title="Input con error"
              code={`<TextInput type="email" />
<ErrorText>Email inválido</ErrorText>`}
            >
              <div className="space-y-2">
                <TextInput type="email" placeholder="correo@ejemplo.com" />
                <ErrorText>Email inválido</ErrorText>
              </div>
            </ExampleBlock>

            <ExampleBlock
              title="Date & Time"
              code={`<DateInput />
<TimeInput />`}
            >
              <div className="space-y-2">
                <DateInput />
                <TimeInput />
              </div>
            </ExampleBlock>
          </div>
        </section>

        {/* ================= Selection ================= */}
        <section className="rounded-2xl border-gray-200 bg-white p-8 shadow-sm space-y-8">
          <SectionTitle>Selección</SectionTitle>

          <div className="grid md:grid-cols-2 gap-8">
            <ExampleBlock
              title="Select"
              code={`<SelectInput>
  <option>Empleado</option>
</SelectInput>`}
            >
              <SelectInput>
                <option>Empleado</option>
                <option>Manager</option>
                <option>Admin</option>
              </SelectInput>
            </ExampleBlock>

            <ExampleBlock
              title="Checkbox"
              code={`<CheckBoxInput label="Activo" />`}
            >
              <CheckBoxInput label="Activo" />
            </ExampleBlock>

            <ExampleBlock
              title="Radio"
              code={`<RadioInput name="gender" label="Masculino" />`}
            >
              <div className="flex gap-6">
                <RadioInput name="gender" label="Masculino" />
                <RadioInput name="gender" label="Femenino" />
              </div>
            </ExampleBlock>
          </div>
        </section>

        {/* ================= Badges ================= */}
        <section className="rounded-2xl border-gray-200 bg-white p-8 shadow-sm space-y-8">
          <SectionTitle>Badges</SectionTitle>

          <ExampleBlock
            title="Estados"
            code={`<Badge variant="success">Activo</Badge>`}
          >
            <div className="flex gap-3 flex-wrap">
              <Badge>Default</Badge>
              <Badge variant="success">Activo</Badge>
              <Badge variant="warning">Pendiente</Badge>
              <Badge variant="danger">Inactivo</Badge>
              <Badge variant="info">Manager</Badge>
            </div>
          </ExampleBlock>
        </section>

        {/* ================= Cards ================= */}
        <section className="rounded-2xl border-gray-200 bg-white p-8 shadow-sm space-y-8">
          <SectionTitle>Cards</SectionTitle>

          <ExampleBlock
            title="Card básica"
            code={`<Card>
  <h3>Información</h3>
</Card>`}
          >
            <Card>
              <h3 className="font-semibold mb-2">Información del empleado</h3>

              <p className="text-sm text-gray-500 mb-4">
                Datos generales del colaborador
              </p>

              <div className="flex gap-3">
                <PrimaryButton>Guardar</PrimaryButton>
                <SecondaryButton>Cancelar</SecondaryButton>
              </div>
            </Card>
          </ExampleBlock>
        </section>

        {/* ================= Icon Buttons ================= */}
        <section className="rounded-2xl border-gray-200 border-gray-200 bg-white p-8 shadow-sm space-y-8">
          <SectionTitle>Icon Buttons</SectionTitle>

          <ExampleBlock
            title="Iconos"
            code={`<IconButton icon={Plus} variant="primary" />`}
          >
            <div className="flex gap-4">
              <IconButton icon={Plus} variant="primary" />
              <IconButton icon={Trash} variant="danger" />
            </div>
          </ExampleBlock>
        </section>
      </div>
    </div>
  );
};

export default UILibraryPage;
