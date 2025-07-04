import React, { useState } from 'react';
import jsPDF from 'jspdf';

const Formularios = () => {
  const formularios = [
    "Carta de despido",
    "Certificado de trabajo",
    "Comunicación de vacaciones",
    "Notificación de sanción",
    "Preaviso"
  ];

  const [formulario, setFormulario] = useState(formularios[0]);
  const [datos, setDatos] = useState({
    nombre: '',
    dni: '',
    fecha: '',
    motivo: '',
    fechaIngreso: '',
    fechaEgreso: '',
    puesto: '',
    desde: '',
    hasta: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatos({ ...datos, [name]: value });
  };

  const generarPDF = (contenido, nombreArchivo) => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text(contenido, 10, 20);
    doc.save(nombreArchivo);
  };

  const handleGenerar = () => {
    let contenido = '';
    const { nombre, dni, fecha, motivo, fechaIngreso, fechaEgreso, puesto, desde, hasta } = datos;

    switch (formulario) {
      case "Carta de despido":
        contenido = `[CARTA DE DESPIDO]\n\nA la fecha ${fecha}, notificamos al Sr./Sra. ${nombre}, DNI ${dni}, su desvinculación de la empresa por el siguiente motivo:\n\n${motivo}\n\nSaludos cordiales,\n\nFirma\nEmpresa`;
        generarPDF(contenido, 'carta_despido.pdf');
        break;
      case "Certificado de trabajo":
        contenido = `[CERTIFICADO DE TRABAJO]\n\nSe deja constancia que el Sr./Sra. ${nombre} trabajó en esta empresa desde el ${fechaIngreso} hasta el ${fechaEgreso}, desempeñándose en el puesto de ${puesto}.\n\nFirma\nEmpresa`;
        generarPDF(contenido, 'certificado_trabajo.pdf');
        break;
      case "Comunicación de vacaciones":
        contenido = `[COMUNICACIÓN DE VACACIONES]\n\nSe informa al Sr./Sra. ${nombre} que se le otorgarán vacaciones desde el día ${desde} hasta el ${hasta}, inclusive.\n\nSaludos cordiales,\n\nFirma\nEmpresa`;
        generarPDF(contenido, 'comunicacion_vacaciones.pdf');
        break;
      case "Notificación de sanción":
        contenido = `[NOTIFICACIÓN DE SANCIÓN]\n\nPor medio de la presente se informa al Sr./Sra. ${nombre} que se le aplica una sanción disciplinaria con fecha ${fecha}, por el siguiente motivo:\n\n${motivo}\n\nFirma\nEmpresa`;
        generarPDF(contenido, 'notificacion_sancion.pdf');
        break;
      case "Preaviso":
        contenido = `[PREAVISO DE DESVINCULACIÓN]\n\nEn fecha ${fecha} se notifica al Sr./Sra. ${nombre} el preaviso correspondiente por:\n\n${motivo}\n\nFirma\nEmpresa`;
        generarPDF(contenido, 'preaviso.pdf');
        break;
      default:
        break;
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">📑 Formularios RRHH</h1>

      <select value={formulario} onChange={(e) => setFormulario(e.target.value)} className="mb-4 p-2 border rounded">
        {formularios.map((f, i) => (
          <option key={i} value={f}>{f}</option>
        ))}
      </select>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {(formulario === "Carta de despido" || formulario === "Notificación de sanción" || formulario === "Preaviso") && (
          <>
            <input name="nombre" value={datos.nombre} onChange={handleChange} placeholder="Nombre del empleado" className="border p-2 rounded" />
            {formulario === "Carta de despido" && (
              <input name="dni" value={datos.dni} onChange={handleChange} placeholder="DNI" className="border p-2 rounded" />
            )}
            <input name="fecha" type="date" value={datos.fecha} onChange={handleChange} className="border p-2 rounded" />
            <textarea name="motivo" value={datos.motivo} onChange={handleChange} placeholder="Motivo" className="border p-2 rounded col-span-2" />
          </>
        )}

        {formulario === "Certificado de trabajo" && (
          <>
            <input name="nombre" value={datos.nombre} onChange={handleChange} placeholder="Nombre del empleado" className="border p-2 rounded" />
            <input name="fechaIngreso" type="date" value={datos.fechaIngreso} onChange={handleChange} className="border p-2 rounded" />
            <input name="fechaEgreso" type="date" value={datos.fechaEgreso} onChange={handleChange} className="border p-2 rounded" />
            <input name="puesto" value={datos.puesto} onChange={handleChange} placeholder="Puesto desempeñado" className="border p-2 rounded" />
          </>
        )}

        {formulario === "Comunicación de vacaciones" && (
          <>
            <input name="nombre" value={datos.nombre} onChange={handleChange} placeholder="Nombre del empleado" className="border p-2 rounded" />
            <input name="desde" type="date" value={datos.desde} onChange={handleChange} className="border p-2 rounded" />
            <input name="hasta" type="date" value={datos.hasta} onChange={handleChange} className="border p-2 rounded" />
          </>
        )}
      </div>

      <button onClick={handleGenerar} className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
        📥 Generar PDF
      </button>
    </div>
  );
};

export default Formularios;
