import type { DemoOrder } from '../Storefront/types'

const money = (amount: number) => `$${amount.toFixed(2)}`

function safeText(value: string) {
  return value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^\x20-\x7E]/g, ' ').replaceAll('\\', '\\\\').replaceAll('(', '\\(').replaceAll(')', '\\)')
}

function text(x: number, y: number, size: number, value: string, bold = false, color = '0.15 0.22 0.17') {
  return `${color} rg BT /${bold ? 'F2' : 'F1'} ${size} Tf ${x} ${y} Td (${safeText(value)}) Tj ET\n`
}

function rule(y: number) {
  return `0.84 0.85 0.81 RG 42 ${y} m 553 ${y} l S\n`
}

function createPage(order: DemoOrder, lines: DemoOrder['lines'], pageIndex: number, pageCount: number) {
  let content = 'q 0.19 0.29 0.23 rg 0 650 595 192 re f Q\n'
  content += text(42, 792, 15, 'LEEX STUDIO', true, '1 1 1')
  content += text(42, 740, 28, 'INVOICE', true, '1 1 1')
  content += text(42, 715, 10, `ORDER ${order.orderNumber}`, false, '0.91 0.94 0.89')
  content += text(420, 790, 9, `PAGE ${pageIndex + 1} OF ${pageCount}`, true, '1 1 1')
  content += text(420, 770, 9, new Date(order.placedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }), false, '1 1 1')
  content += text(42, 615, 9, 'SHIP TO', true, '0.19 0.29 0.23')
  content += text(42, 596, 10, `${order.address.firstName} ${order.address.lastName}`)
  content += text(42, 580, 9, order.address.addressLine1)
  if (order.address.addressLine2) content += text(42, 565, 9, order.address.addressLine2)
  content += text(42, 548, 9, `${order.address.city}, ${order.address.region ?? ''} ${order.address.postalCode}`)
  content += text(42, 532, 9, order.address.country)
  content += text(345, 615, 9, 'PAYMENT', true, '0.19 0.29 0.23')
  content += text(345, 596, 9, order.paymentMethod.name)
  content += text(345, 580, 9, order.paymentStatus)
  content += text(345, 548, 9, 'Natural linen, thoughtfully made.')
  content += text(42, 500, 9, 'ITEM', true, '0.19 0.29 0.23')
  content += text(360, 500, 9, 'QTY', true, '0.19 0.29 0.23')
  content += text(414, 500, 9, 'PRICE', true, '0.19 0.29 0.23')
  content += text(494, 500, 9, 'TOTAL', true, '0.19 0.29 0.23')
  content += rule(490)

  let rowY = 470
  for (const line of lines) {
    content += text(42, rowY, 10, line.name.slice(0, 43), true)
    content += text(42, rowY - 14, 8, line.color)
    content += text(365, rowY - 2, 9, String(line.quantity))
    content += text(414, rowY - 2, 9, money(line.unitPrice))
    content += text(494, rowY - 2, 9, money(line.unitPrice * line.quantity))
    rowY -= 28
    content += rule(rowY + 8)
  }

  if (pageIndex === pageCount - 1) {
    let totalY = rowY - 16
    const totals: [string, string][] = [['Subtotal', money(order.subtotal)]]
    if (order.discount) totals.push([`Coupon savings${order.couponCode ? ` (${order.couponCode})` : ''}`, `-${money(order.discount)}`])
    totals.push(['Shipping', order.shipping ? money(order.shipping) : 'Complimentary'], ['Estimated tax', money(order.tax)])
    for (const [label, amount] of totals) {
      content += text(365, totalY, 9, label)
      content += text(494, totalY, 9, amount)
      totalY -= 17
    }
    content += rule(totalY + 6)
    content += text(365, totalY - 13, 11, 'TOTAL PAID', true, '0.19 0.29 0.23')
    content += text(490, totalY - 13, 11, money(order.total), true, '0.19 0.29 0.23')
  }

  content += text(42, 43, 8, 'Thank you for choosing LEEX Studio. Made for the many days ahead.', false, '0.40 0.42 0.39')
  return content
}

export function downloadOrderInvoice(order: DemoOrder) {
  const chunks: DemoOrder['lines'][] = []
  for (let index = 0; index < order.lines.length; index += 12) chunks.push(order.lines.slice(index, index + 12))
  const pages = chunks.length ? chunks : [[]]
  const objects: string[] = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    `<< /Type /Pages /Kids [${pages.map((_, index) => `${5 + index * 2} 0 R`).join(' ')}] /Count ${pages.length} >>`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>',
  ]

  pages.forEach((lines, index) => {
    const pageId = 5 + index * 2
    const contentId = pageId + 1
    const stream = createPage(order, lines, index, pages.length)
    objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentId} 0 R >>`)
    objects.push(`<< /Length ${stream.length} >>\nstream\n${stream}endstream`)
  })

  let pdfDocument = '%PDF-1.4\n%LEEX\n'
  const offsets = [0]
  objects.forEach((object, index) => {
    offsets.push(pdfDocument.length)
    pdfDocument += `${index + 1} 0 obj\n${object}\nendobj\n`
  })
  const xrefOffset = pdfDocument.length
  pdfDocument += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`
  for (const offset of offsets.slice(1)) pdfDocument += `${String(offset).padStart(10, '0')} 00000 n \n`
  pdfDocument += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`

  const link = document.createElement('a')
  link.href = URL.createObjectURL(new Blob([pdfDocument], { type: 'application/pdf' }))
  link.download = `LEEX-invoice-${order.orderNumber}.pdf`
  link.click()
  URL.revokeObjectURL(link.href)
}