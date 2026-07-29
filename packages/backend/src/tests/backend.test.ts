import assert from 'assert';
import { calculateTimeElapsed } from '@recuerdos-qr/shared';
import { db } from '../db/db';

console.log('🧪 Ejecutando suite de pruebas unitarias e integración para Recuerdos QR...');

// Test 1: Date calculation logic
const timeResult = calculateTimeElapsed('2022-02-05', '2026-02-05');
assert.strictEqual(timeResult.years, 4, 'Años transcurridos debe ser 4');
assert.strictEqual(timeResult.months, 0, 'Meses transcurridos debe ser 0');
assert.strictEqual(timeResult.days, 0, 'Días transcurridos debe ser 0');
console.log('✅ Prueba 1: Cálculo exacto de contador de tiempo pasado exitosamente.');

// Test 2: Database state initialization and demo seed
const projects = db.getState.projects;
assert.ok(projects.length >= 1, 'Debe existir al menos 1 proyecto demo en la base de datos');
const demoProject = projects.find((p) => p.slug === 'camila-y-diego');
assert.ok(demoProject, 'El proyecto demo Camila y Diego debe estar presente');
assert.strictEqual(demoProject?.status, 'published', 'El proyecto demo debe estar publicado');
console.log('✅ Prueba 2: Inicialización de base de datos y proyecto demo pasado exitosamente.');

// Test 3: Sections & Media links
const demoSections = db.getState.sections.filter((s) => s.project_id === demoProject.id);
assert.ok(demoSections.length >= 4, 'El proyecto demo debe tener al menos 4 secciones configuradas');
console.log('✅ Prueba 3: Carga de secciones del regalo pasado exitosamente.');

console.log('🎉 ¡Todas las pruebas automatizadas del backend se ejecutaron sin errores!');
