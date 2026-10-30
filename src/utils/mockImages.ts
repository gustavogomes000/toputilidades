// Realistic high-quality SVG data-URIs for receipts, POS slips, safe, and selfies for offline and instant demo simulation

export const MOCK_IMAGES = {
  receiptSnack: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600" style="background:%23FFFDF7;font-family:monospace;font-size:13px;color:%23222;">
    <rect width="100%" height="100%" fill="%23FFFDF7" stroke="%23DDD" stroke-width="2"/>
    <text x="200" y="45" font-size="16" font-weight="bold" text-anchor="middle">PADARIA E LANCHONETE CENTRAL</text>
    <text x="200" y="65" text-anchor="middle">CNPJ: 14.223.888/0001-44</text>
    <text x="200" y="85" text-anchor="middle">AV. IGUATEMI, 820 - CAMPINAS/SP</text>
    <line x1="20" y1="100" x2="380" y2="100" stroke="%23333" stroke-dasharray="4,4"/>
    <text x="200" y="125" font-weight="bold" text-anchor="middle">CUPOM FISCAL / COMPROVANTE</text>
    <text x="30" y="155">DATA: 27/10/2026 15:40</text>
    <text x="30" y="175">DESTINO: TOP UTILIDADES (LJ 07)</text>
    <line x1="20" y1="190" x2="380" y2="190" stroke="%23DDD"/>
    <text x="30" y="215">QTD  DESCRICAO               VALOR</text>
    <text x="30" y="240">02   LANCHE NATURAL QUEIJO   R$ 28,00</text>
    <text x="30" y="265">02   SUCO LARANJA 500ML      R$ 18,00</text>
    <text x="30" y="290">01   AGUA MINERAL C/ GAS     R$ 8,00</text>
    <line x1="20" y1="315" x2="380" y2="315" stroke="%23333" stroke-dasharray="4,4"/>
    <text x="30" y="345" font-size="16" font-weight="bold">TOTAL A PAGAR:        R$ 54,00</text>
    <text x="30" y="375">FORMA DE PAGTO: DINHEIRO CAIXA</text>
    <rect x="50" y="420" width="300" height="90" rx="8" fill="%23EE2B33" fill-opacity="0.1" stroke="%23EE2B33" stroke-width="2"/>
    <text x="200" y="455" font-size="14" font-weight="bold" fill="%23EE2B33" text-anchor="middle">PAGO COM RECURSO DE CAIXA</text>
    <text x="200" y="480" font-size="12" fill="%23EE2B33" text-anchor="middle">AUTORIZADO: GERENTE CARLOS</text>
    <text x="200" y="560" font-size="11" text-anchor="middle" fill="%23888">OBRIGADO PELA PREFERENCIA!</text>
  </svg>`,

  receiptNewspaper: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600" style="background:%23FCFCFD;font-family:monospace;font-size:13px;color:%23111;">
    <rect width="100%" height="100%" fill="%23FCFCFD" stroke="%23DDD" stroke-width="2"/>
    <text x="200" y="50" font-size="17" font-weight="bold" text-anchor="middle">DISTRIBUIDORA DE JORNAIS CAMPINAS</text>
    <text x="200" y="72" text-anchor="middle">RECIBO DE VENDA N. 04891</text>
    <line x1="20" y1="95" x2="380" y2="95" stroke="%23333" stroke-dasharray="4,4"/>
    <text x="30" y="130">CLIENTE: TOP UTILIDADES LJ 07</text>
    <text x="30" y="155">DATA ENTREGA: 27/10/2026 - MANHA</text>
    <line x1="20" y1="180" x2="380" y2="180" stroke="%23DDD"/>
    <text x="30" y="210">ITEM: JORNAL IMPRESSO PARA LOJA</text>
    <text x="30" y="235">FINALIDADE: EMBALAGEM DE PRESENTES</text>
    <text x="30" y="260">E LOUCAS FRAGEIS (LOTE 10 FARDOS)</text>
    <line x1="20" y1="290" x2="380" y2="290" stroke="%23333" stroke-dasharray="4,4"/>
    <text x="30" y="330" font-size="18" font-weight="bold">VALOR LIQUIDO:      R$ 300,00</text>
    <text x="30" y="360">RECEBIDO EM ESPECIE DO GERENTE</text>
    <rect x="60" y="410" width="280" height="95" rx="8" fill="%230B1560" fill-opacity="0.08" stroke="%230B1560" stroke-width="1.5"/>
    <text x="200" y="445" font-size="13" font-weight="bold" fill="%230B1560" text-anchor="middle">DESPESA OPERACIONAL LOJA 7</text>
    <text x="200" y="470" font-size="12" fill="%230B1560" text-anchor="middle">ASSINATURA: M. SILVA (ENTREGADOR)</text>
    <text x="200" y="555" font-size="11" text-anchor="middle" fill="%23777">AUTORIZADO AUDITORIA MATRIZ</text>
  </svg>`,

  posSlipStone: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="620" viewBox="0 0 400 620" style="background:%23F5FAF7;font-family:monospace;font-size:13px;color:%230A5C36;">
    <rect width="100%" height="100%" fill="%23F7FAF8" stroke="%2300A868" stroke-width="2"/>
    <rect x="0" y="0" width="400" height="45" fill="%2300A868"/>
    <text x="200" y="28" font-size="18" font-weight="bold" fill="%23FFF" text-anchor="middle">STONE - FECHAMENTO DO DIA</text>
    <text x="200" y="70" font-size="14" font-weight="bold" text-anchor="middle">ESTABELECIMENTO: TOP UTILIDADES 07</text>
    <text x="200" y="90" text-anchor="middle">TERMINAL: STN-8921 (CAIXA 01)</text>
    <text x="200" y="110" text-anchor="middle">DATA: 27/10/2026 - HORARIO: 19:42:15</text>
    <line x1="20" y1="130" x2="380" y2="130" stroke="%2300A868" stroke-dasharray="4,4"/>
    <text x="30" y="165" font-size="14" font-weight="bold">RESUMO DE TRANSACOES STONE:</text>
    <text x="30" y="200">CARTAO DE CREDITO:      R$ 5.200,00</text>
    <text x="30" y="225">CARTAO DE DEBITO:       R$ 2.300,00</text>
    <text x="30" y="255" font-size="15" font-weight="bold">SUBTOTAL CARTAO:        R$ 7.500,00</text>
    <line x1="30" y1="275" x2="370" y2="275" stroke="%23CCC"/>
    <text x="30" y="305" font-size="14" font-weight="bold">PIX NO POS (QR CODE):</text>
    <text x="30" y="335" font-size="15" font-weight="bold">SUBTOTAL PIX:           R$ 4.000,00</text>
    <line x1="20" y1="365" x2="380" y2="365" stroke="%2300A868" stroke-width="2"/>
    <text x="30" y="405" font-size="18" font-weight="bold" fill="%2300A868">TOTAL GERAL STONE:   R$ 11.500,00</text>
    <text x="30" y="435">TOTAL DE OPERACOES: 142 APROVADAS</text>
    <text x="30" y="460">LOTE FECHADO COM SUCESSO</text>
    <rect x="40" y="495" width="320" height="70" rx="8" fill="%2300A868" fill-opacity="0.1" stroke="%2300A868"/>
    <text x="200" y="525" font-size="12" font-weight="bold" text-anchor="middle">FILIPETA CONFERIDA PELO GERENTE</text>
    <text x="200" y="545" font-size="11" text-anchor="middle">AUTENTICACAO STONE: 991823.AF.2710</text>
  </svg>`,

  posSlipCielo: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="620" viewBox="0 0 400 620" style="background:%23F2F8FD;font-family:monospace;font-size:13px;color:%230066B3;">
    <rect width="100%" height="100%" fill="%23F4F9FD" stroke="%230066B3" stroke-width="2"/>
    <rect x="0" y="0" width="400" height="45" fill="%230066B3"/>
    <text x="200" y="28" font-size="18" font-weight="bold" fill="%23FFF" text-anchor="middle">CIELO - RELATORIO DETALHADO</text>
    <text x="200" y="70" font-size="14" font-weight="bold" text-anchor="middle">TOP UTILIDADES - LOJA 07 CAMPINAS</text>
    <text x="200" y="90" text-anchor="middle">POS CIELO LIO - CLO-4412 (CX 02)</text>
    <text x="200" y="110" text-anchor="middle">PERIODO: 27/10/2026 - 19:43:00</text>
    <line x1="20" y1="130" x2="380" y2="130" stroke="%230066B3" stroke-dasharray="4,4"/>
    <text x="30" y="165" font-size="14" font-weight="bold">TRANSACOES PROCESSADAS:</text>
    <text x="30" y="200">CREDITO A VISTA:        R$ 2.812,50</text>
    <text x="30" y="225">CREDITO PARCELADO:      R$ 1.710,00</text>
    <text x="30" y="255" font-size="15" font-weight="bold">SUBTOTAL CARTAO CIELO:  R$ 4.522,50</text>
    <line x1="30" y1="275" x2="370" y2="275" stroke="%23CCC"/>
    <text x="30" y="305" font-size="14" font-weight="bold">PIX EM CONTA CIELO:</text>
    <text x="30" y="335" font-size="15" font-weight="bold">SUBTOTAL PIX CIELO:     R$ 2.811,00</text>
    <line x1="20" y1="365" x2="380" y2="365" stroke="%230066B3" stroke-width="2"/>
    <text x="30" y="405" font-size="18" font-weight="bold" fill="%230066B3">TOTAL GERAL CIELO:   R$ 7.333,50</text>
    <text x="30" y="435">98 VENDAS CONCLUIDAS</text>
    <text x="30" y="460">CV CIELO: 778102.271026.CAMP</text>
    <rect x="40" y="495" width="320" height="70" rx="8" fill="%230066B3" fill-opacity="0.1" stroke="%230066B3"/>
    <text x="200" y="525" font-size="12" font-weight="bold" text-anchor="middle">CONCILIADO COM SUPORTE TEF</text>
    <text x="200" y="545" font-size="11" text-anchor="middle">FILIPETA INTEGRADA A PASTA DO DIA</text>
  </svg>`,

  drawerCashPhoto: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="500" height="380" viewBox="0 0 500 380" style="background:%232A323D;font-family:sans-serif;">
    <rect width="100%" height="100%" fill="%231E293B"/>
    <rect x="25" y="25" width="450" height="330" rx="14" fill="%23334155" stroke="%2364748B" stroke-width="3"/>
    <text x="250" y="60" font-size="16" font-weight="bold" fill="%23FFF" text-anchor="middle">CONFERENCIA FISICA DA GAVETA - LOJA 07</text>
    
    <!-- Compartimentos da Gaveta -->
    <rect x="45" y="85" width="90" height="150" rx="6" fill="%23475569" stroke="%2394A3B8"/>
    <text x="90" y="110" font-size="12" font-weight="bold" fill="%23FEF08A" text-anchor="middle">NOTAS 100</text>
    <rect x="55" y="125" width="70" height="95" rx="3" fill="%230284C7" opacity="0.8"/>
    <text x="90" y="175" font-size="11" fill="%23FFF" font-weight="bold" text-anchor="middle">R$ 1.500</text>

    <rect x="150" y="85" width="90" height="150" rx="6" fill="%23475569" stroke="%2394A3B8"/>
    <text x="195" y="110" font-size="12" font-weight="bold" fill="%23FEF08A" text-anchor="middle">NOTAS 50</text>
    <rect x="160" y="125" width="70" height="95" rx="3" fill="%23F59E0B" opacity="0.8"/>
    <text x="195" y="175" font-size="11" fill="%23FFF" font-weight="bold" text-anchor="middle">R$ 1.150</text>

    <rect x="255" y="85" width="90" height="150" rx="6" fill="%23475569" stroke="%2394A3B8"/>
    <text x="300" y="110" font-size="12" font-weight="bold" fill="%23FEF08A" text-anchor="middle">NOTAS 20/10</text>
    <rect x="265" y="125" width="70" height="95" rx="3" fill="%23DC2626" opacity="0.8"/>
    <text x="300" y="175" font-size="11" fill="%23FFF" font-weight="bold" text-anchor="middle">R$ 780</text>

    <rect x="360" y="85" width="90" height="150" rx="6" fill="%23475569" stroke="%2394A3B8"/>
    <text x="405" y="110" font-size="12" font-weight="bold" fill="%23FEF08A" text-anchor="middle">MOEDAS</text>
    <circle cx="405" cy="155" r="28" fill="%23E2E8F0" stroke="%2394A3B8" stroke-width="2"/>
    <text x="405" y="160" font-size="11" fill="%230F172A" font-weight="bold" text-anchor="middle">R$ 321,50</text>

    <!-- Tarja Informativa Inferior -->
    <rect x="45" y="255" width="410" height="75" rx="8" fill="%230F172A" stroke="%2322C55E" stroke-width="2"/>
    <text x="65" y="282" font-size="13" font-weight="bold" fill="%2322C55E">TOTAL DINHEIRO CONTADO: R$ 3.751,50</text>
    <text x="65" y="305" font-size="11" fill="%23CBD5E1">Esperado: R$ 3.751,50 | Divergência: R$ 0,00 (Exato)</text>
    <text x="65" y="322" font-size="10" fill="%2394A3B8">Registro Fotográfico: 27/10/2026 19:44:10 • Gerente Carlos</text>
  </svg>`,

  bankDepositSlip: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="420" height="580" viewBox="0 0 420 580" style="background:%23FBFDFF;font-family:sans-serif;color:%230A2540;">
    <rect width="100%" height="100%" fill="%23FBFDFF" stroke="%23CBD5E1" stroke-width="2"/>
    <rect x="0" y="0" width="420" height="60" fill="%230B1560"/>
    <text x="210" y="38" font-size="17" font-weight="bold" fill="%23FFF" text-anchor="middle">BANCO DO BRASIL - COMPROVANTE</text>
    <text x="30" y="95" font-size="13" font-weight="bold">DEPOSITO IDENTIFICADO EM CONTA CORRENTE</text>
    <text x="30" y="120" font-size="12" fill="%2364748B">CANAL: TERMINAL ELETRONICO / ENVELOPE AUDITADO</text>
    <line x1="20" y1="135" x2="400" y2="135" stroke="%23E2E8F0"/>
    <text x="30" y="165" font-size="12">FAVORECIDO: TOP UTILIDADES E PRESENTES S/A</text>
    <text x="30" y="190" font-size="12">AGENCIA: 1823-4 | CONTA: 29841-0</text>
    <text x="30" y="215" font-size="12">UNIDADE ORIGEM: LOJA 07 CAMPINAS (SINT-007)</text>
    <text x="30" y="240" font-size="12">DATA PROCESSAMENTO: 26/10/2026 - 11:32:45</text>
    <line x1="20" y1="260" x2="400" y2="260" stroke="%230B1560" stroke-width="1.5"/>
    <text x="30" y="295" font-size="18" font-weight="bold" fill="%230B1560">VALOR DEPOSITADO:  R$ 14.500,00</text>
    <text x="30" y="325" font-size="12" fill="%2316A34A" font-weight="bold">AUTENTICACAO BANCARIA: 882.019.227.1026.007</text>
    <rect x="30" y="350" width="360" height="110" rx="8" fill="%23F1F5F9" stroke="%23CBD5E1"/>
    <text x="45" y="380" font-size="12" font-weight="bold" fill="%23334155">OBSERVACAO REGISTRADA NA AUDITORIA:</text>
    <text x="45" y="405" font-size="11" fill="%23475569">"Depósito referente ao saldo acumulado de cofre</text>
    <text x="45" y="425" font-size="11" fill="%23475569">dos dias 24/10 e 25/10. Malote lacrado n. 094812."</text>
    <text x="45" y="445" font-size="11" font-weight="bold" fill="%2316A34A">Status: CONCILIADO PELO FINANCEIRO MATRIZ</text>
    <text x="210" y="525" font-size="11" fill="%2394A3B8" text-anchor="middle">DOCUMENTO HOMOLOGADO PELO BACKOFFICE</text>
  </svg>`,

  managerSelfie: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="480" viewBox="0 0 400 480" style="background:%230F172A;font-family:sans-serif;">
    <rect width="100%" height="100%" fill="%230F172A"/>
    <!-- Moldura Biometrica Oval -->
    <ellipse cx="200" cy="210" rx="130" ry="160" fill="none" stroke="%2322C55E" stroke-width="3" stroke-dasharray="8,6"/>
    <!-- Ilustracao do Rosto do Gerente -->
    <circle cx="200" cy="180" r="75" fill="%23FBBF24" opacity="0.85"/>
    <path d="M 140 310 Q 200 260 260 310 L 290 400 L 110 400 Z" fill="%230B1560"/>
    <circle cx="175" cy="175" r="9" fill="%231E293B"/>
    <circle cx="225" cy="175" r="9" fill="%231E293B"/>
    <path d="M 180 215 Q 200 230 220 215" stroke="%231E293B" stroke-width="4" fill="none" stroke-linecap="round"/>
    
    <!-- Crachá / Tag de Reconhecimento Facial -->
    <rect x="50" y="390" width="300" height="70" rx="10" fill="%231E293B" stroke="%2322C55E" stroke-width="2"/>
    <text x="200" y="415" font-size="13" font-weight="bold" fill="%2322C55E" text-anchor="middle">BIOMETRIA FACIAL HOMOLOGADA</text>
    <text x="200" y="433" font-size="11" fill="%23FFF" text-anchor="middle">CARLOS EDUARDO (GERENTE LOJA 07)</text>
    <text x="200" y="450" font-size="10" fill="%2394A3B8" text-anchor="middle">27/10/2026 19:45:00 • IP 177.18.24.11</text>
  </svg>`,

  auditorSelfie: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="480" viewBox="0 0 400 480" style="background:%230F172A;font-family:sans-serif;">
    <rect width="100%" height="100%" fill="%230F172A"/>
    <ellipse cx="200" cy="210" rx="130" ry="160" fill="none" stroke="%2338BDF8" stroke-width="3" stroke-dasharray="8,6"/>
    <circle cx="200" cy="180" r="75" fill="%23E2E8F0" opacity="0.9"/>
    <path d="M 140 310 Q 200 260 260 310 L 290 400 L 110 400 Z" fill="%23EE2B33"/>
    <circle cx="175" cy="175" r="8" fill="%230F172A"/>
    <circle cx="225" cy="175" r="8" fill="%230F172A"/>
    <path d="M 180 215 Q 200 225 220 215" stroke="%230F172A" stroke-width="3" fill="none"/>
    <rect x="50" y="390" width="300" height="70" rx="10" fill="%231E293B" stroke="%2338BDF8" stroke-width="2"/>
    <text x="200" y="415" font-size="13" font-weight="bold" fill="%2338BDF8" text-anchor="middle">CHECK-IN SUPERVISAO PRESENCIAL</text>
    <text x="200" y="433" font-size="11" fill="%23FFF" text-anchor="middle">MARCOS VINICIUS (SUPERVISOR)</text>
    <text x="200" y="450" font-size="10" fill="%2394A3B8" text-anchor="middle">27/10/2026 19:50:12 • GEO: CAMPINAS</text>
  </svg>`,

  safeInspectionPhoto: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="500" height="380" viewBox="0 0 500 380" style="background:%231E293B;font-family:sans-serif;">
    <rect width="100%" height="100%" fill="%230F172A"/>
    <!-- Porta do Cofre Aberta -->
    <rect x="40" y="40" width="420" height="300" rx="16" fill="%23334155" stroke="%23CBD5E1" stroke-width="4"/>
    <circle cx="90" cy="190" r="35" fill="%2364748B" stroke="%2394A3B8" stroke-width="4"/>
    <rect x="150" y="70" width="280" height="240" rx="8" fill="%231E293B" stroke="%23475569" stroke-width="2"/>
    
    <!-- Envelopes e Fardos dentro do cofre -->
    <rect x="170" y="90" width="110" height="70" rx="4" fill="%23FEF08A" stroke="%23CA8A04"/>
    <text x="225" y="125" font-size="11" font-weight="bold" fill="%23854D0E" text-anchor="middle">26/10: R$ 3.401,50</text>
    
    <rect x="300" y="90" width="110" height="70" rx="4" fill="%23FEF08A" stroke="%23CA8A04"/>
    <text x="355" y="125" font-size="11" font-weight="bold" fill="%23854D0E" text-anchor="middle">27/10: R$ 3.751,50</text>
    
    <!-- Banner de Auditoria -->
    <rect x="170" y="190" width="240" height="100" rx="8" fill="%230F172A" stroke="%2322C55E" stroke-width="2"/>
    <text x="290" y="220" font-size="14" font-weight="bold" fill="%2322C55E" text-anchor="middle">CONFERIDO NO COFRE:</text>
    <text x="290" y="250" font-size="18" font-weight="bold" fill="%23FFF" text-anchor="middle">R$ 7.153,00</text>
    <text x="290" y="275" font-size="10" fill="%2394A3B8" text-anchor="middle">Soma dos envelopes bate 100% c/ Sistema</text>
  </svg>`,

  defaultSignature: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="150" viewBox="0 0 400 150">
    <path d="M 40 85 Q 80 40 120 70 T 180 60 T 240 100 T 320 50 Q 360 70 380 90" stroke="%230B1560" stroke-width="3" fill="none" stroke-linecap="round"/>
    <text x="200" y="130" font-family="sans-serif" font-size="11" fill="%2364748B" text-anchor="middle">Carlos Eduardo - Gerente Loja 07</text>
  </svg>`,
};
