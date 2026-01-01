import { CellData, SheetData } from '../types';

export class FormulaEngine {
  // Simple regex for cell references (e.g., A1, Z99)
  private static cellRegex = /[A-Z]+[0-9]+/g;

  static evaluate(sheet: SheetData, cellId: string, rawValue: string): string | number | boolean {
    if (!rawValue.startsWith('=')) {
      const num = parseFloat(rawValue);
      return isNaN(num) ? rawValue : num;
    }

    const formula = rawValue.substring(1).toUpperCase();

    try {
      // 1. Handle Ranges (e.g., SUM(A1:A3))
      // This is a naive implementation replacing ranges with array literals or processing them directly
      // For this demo, we implemented a few basic functions manually.

      if (formula.startsWith('SUM(') && formula.endsWith(')')) {
        const content = formula.slice(4, -1);
        const values = this.getRangeValues(sheet, content);
        return values.reduce((acc: number, val) => acc + (typeof val === 'number' ? val : 0), 0);
      }
      
      if (formula.startsWith('AVG(') && formula.endsWith(')')) {
        const content = formula.slice(4, -1);
        const values = this.getRangeValues(sheet, content);
        const sum = values.reduce((acc: number, val) => acc + (typeof val === 'number' ? val : 0), 0);
        return values.length ? sum / values.length : 0;
      }
      
      if (formula.startsWith('MAX(') && formula.endsWith(')')) {
        const content = formula.slice(4, -1);
        const values = this.getRangeValues(sheet, content).filter(v => typeof v === 'number') as number[];
        return Math.max(...values);
      }

      // 2. Handle simple arithmetic with direct cell references
      // Replace references with their values
      const parsedFormula = formula.replace(this.cellRegex, (match) => {
        const cell = sheet.cells[match];
        const val = cell?.computed ?? 0;
        return typeof val === 'string' ? `"${val}"` : String(val);
      });

      // Security note: In prod, use a safe math parser. 'Function' is unsafe but standard for simple JS evaluations in demos.
      // eslint-disable-next-line
      return new Function(`return ${parsedFormula}`)();

    } catch (e) {
      console.error(e);
      return '#ERROR!';
    }
  }

  // Helper to resolve "A1:A3" or "A1,B2" to a list of values
  private static getRangeValues(sheet: SheetData, rangeString: string): (string | number | boolean)[] {
    const values: (string | number | boolean)[] = [];
    
    // Handle comma separated args
    const parts = rangeString.split(',');

    parts.forEach(part => {
      part = part.trim();
      if (part.includes(':')) {
        // Range A1:A5
        const [start, end] = part.split(':');
        const cells = this.expandRange(start, end);
        cells.forEach(c => {
           const val = sheet.cells[c]?.computed;
           values.push(val === undefined ? 0 : val);
        });
      } else {
        // Single cell
        const val = sheet.cells[part]?.computed;
        values.push(val === undefined ? 0 : val);
      }
    });

    return values;
  }

  // Expand "A1:B2" -> ["A1", "B1", "A2", "B2"]
  private static expandRange(start: string, end: string): string[] {
    const startCol = start.match(/[A-Z]+/)?.[0] || 'A';
    const startRow = parseInt(start.match(/[0-9]+/)?.[0] || '1');
    const endCol = end.match(/[A-Z]+/)?.[0] || 'A';
    const endRow = parseInt(end.match(/[0-9]+/)?.[0] || '1');

    const startColIdx = this.colToIndex(startCol);
    const endColIdx = this.colToIndex(endCol);

    const cells: string[] = [];
    for (let r = startRow; r <= endRow; r++) {
      for (let c = startColIdx; c <= endColIdx; c++) {
        cells.push(`${this.indexToCol(c)}${r}`);
      }
    }
    return cells;
  }

  static colToIndex(col: string): number {
    let sum = 0;
    for (let i = 0; i < col.length; i++) {
      sum *= 26;
      sum += col.charCodeAt(i) - 'A'.charCodeAt(0) + 1;
    }
    return sum - 1;
  }

  static indexToCol(index: number): string {
    let col = '';
    let temp = index;
    while (temp >= 0) {
      col = String.fromCharCode((temp % 26) + 65) + col;
      temp = Math.floor(temp / 26) - 1;
    }
    return col;
  }
}