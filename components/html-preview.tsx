"use client"

interface HtmlPreviewProps {
  htmlContent: string
  title: string
}

export default function HtmlPreview({ htmlContent, title }: HtmlPreviewProps) {
  // Convert React className to regular class for HTML preview
  const processedHtml = htmlContent
    .replace(/className="/g, 'class="')
    .replace(
      /class="user-list"/g,
      'class="user-list" style="padding: 20px; background: #F0F0F0; border-radius: 8px; border: 1px solid #E0E0E0;"', // Simplified styling
    )
    .replace(
      /class="user-card"/g,
      'class="user-card" style="background: #FFFFFF; padding: 16px; margin-bottom: 12px; border-radius: 8px; border: 1px solid #E0E0E0;"', // Simplified styling
    )
    .replace(
      /class="status active"/g,
      'class="status active" style="background: #D4EDDA; color: #285A3B; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 500;"',
    )
    .replace(
      /class="status inactive"/g,
      'class="status inactive" style="background: #F8D7DA; color: #721C24; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 500;"',
    )
    .replace(
      /class="no-users"/g,
      'class="no-users" style="text-align: center; color: #1A1A1A; font-style: italic; padding: 40px;"',
    )
    .replace(
      /class="product-grid"/g,
      'class="product-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 16px; padding: 20px; background: #F0F0F0; border-radius: 8px; border: 1px solid #E0E0E0;"', // Simplified styling
    )
    .replace(
      /class="product-card"/g,
      'class="product-card" style="background: #FFFFFF; padding: 16px; border-radius: 8px; border: 1px solid #E0E0E0;"', // Simplified styling
    )
    .replace(
      /class="price"/g,
      'class="price" style="font-size: 18px; font-weight: bold; color: #285A3B; margin: 8px 0;"',
    )
    .replace(
      /class="available"/g,
      'class="available" style="background: #D4EDDA; color: #285A3B; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 500;"',
    )
    .replace(
      /class="no-products"/g,
      'class="no-products" style="text-align: center; color: #1A1A1A; font-style: italic; padding: 40px;"',
    )
    .replace(/<h3>/g, '<h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 600; color: #111827;">')
    .replace(/<p>/g, '<p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">')
    .replace(
      /<img /g,
      '<img style="width: 100%; height: 120px; object-fit: cover; border-radius: 4px; margin-bottom: 8px; background: #e5e7eb; border: 1px solid #D0D0D0;" ', // Simplified styling
    )

  return (
    <div className="space-y-4 text-neobrutal-text">
      <h4 className="font-medium text-neobrutal-text">{title}</h4>
      <div className="rounded-lg p-4 bg-neobrutal-card border-2 border-neobrutal-border shadow-[4px_4px_0px_0px_#333333]">
        {" "}
        {/* Main container retains neobrutalism */}
        <div className="text-sm text-neobrutal-text/80 mb-3">HTML Preview:</div>
        <div
          className="rounded-lg p-4 bg-neobrutal-bg" // Removed border and shadow from inner preview
          dangerouslySetInnerHTML={{ __html: processedHtml }}
        />
      </div>
    </div>
  )
}
