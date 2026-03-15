# Blue-Yellow-White UI Redesign Guide

## Primary Colors
- **Blue (Primary)**: `blue-600` to `blue-700` - Used for headers, primary buttons, accents
- **Yellow (Accent)**: `yellow-500` to `yellow-600` - Used for highlights, alerts, secondary accents  
- **White (Background)**: `bg-white` - All backgrounds
- **Gray (Text & Borders)**:  
  - Text: `text-gray-900` (headings), `text-gray-600` (body), `text-gray-500` (muted)
  - Borders: `border-gray-200`, `border-gray-100`

## Component Updates Completed ✅

### Layout Components
- **AdminSidebar.tsx** ✅
  - Logo: Blue gradient background (from-blue-600 to-blue-700)
  - Navigation: Blue hover states, active blue accent with border-left
  - Borders: Gray borders throughout
  - Shadows: shadow-lg, shadow-md with hover effects

- **Navbar.tsx** ✅
  - Header: Blue gradient (from-blue-600 to-blue-700) with yellow bottom border  
  - Notifications: Yellow badges with shadow-md
  - Profile: Yellow border on image, blue hover states
  - Dropdowns: White background, blue text on hover, gray borders

### Dashboard Components  
- **DashboardPage.tsx** ✅
  - Background: White
  - Cards: Gray borders, shadow-md → shadow-lg on hover
  - Compliance Cards: Blue progress bar (90%+), yellow(70-89%), red(<70%)
  - KPI Cards: Alternating blue and yellow gradients
  - Buttons: Blue gradient primary, yellow accents

- **ComplianceStatusCard.tsx** ✅
  - Border: Gray with blue hover effect
  - Text: Gray-900 / Gray-800
  - Progress bars: Blue/Yellow/Red
  - Hover: Light blue background

- **KPICard.tsx** ✅
  - Gradient backgrounds: Blue and Yellow alternating
  - Shadows: shadow-md with gray opacity
  - Border: Gray-200

### Document Repository
- **DocumentRepositoryPage.tsx** ✅
  - KPI Icons: Blue and yellow colors

- **DocumentExplorer.tsx** ✅
  - Breadcrumb: Blue home icon, gray text
  - Folder section: Gray borders, blue buttons
  - Create/Rename dialogs: Blue focus rings, gray text
  - Tables/Lists: Gray borders

## Remaining Updates Needed

### UI Components
- [ ] **button.tsx** - Update all button variants
  - Primary: Blue gradient
  - Secondary: Gray borders with gray text
  - Destructive: Red variants
  - Ghost: Gray text with hover effects
  
- [ ] **dialog.tsx** - Update dialog styling
  - Border: gray-200
  - Title: gray-900
  - Background: white
  
- [ ] **dropdown-menu.tsx** - Menu items with blue hover
  - Hover: bg-blue-50, text-blue-700
  - Border: gray-200
  - Icons: blue-600

- [ ] **select.tsx**, **textarea.tsx**, **tabs.tsx** - Update form elements
  - Focus: blue-600 focus ring
  - Border: gray-200
  - Text: gray-900

### Page Components

#### Teacher Directory
- [ ] **TeacherDirectoryPage.tsx**
  - Filter section: Gray backgrounds  
  - Cards: Gray borders, blue hover, shadow-md
  
- [ ] **TeacherCard.tsx** - Update card styling
  - Border: gray-200
  - Icons: blue-600
  - Buttons: Blue primary
  
- [ ] **Filters.tsx**, **BulkActions.tsx**, **AddTeacher.tsx**
  - All inputs: Blue focus rings
  - Buttons: Blue primary
  - Icons: Blue-600

#### Teacher Profile
- [ ] **TeacherProfilePage.tsx** - Overall styling
- [ ] **PersonalInformationForm.tsx** - Form styling with blue inputs
- [ ] **BasicInformationCard.tsx** - Blue headers, gray borders
- [ ] **DocumentsTab.tsx** - Update document handling styling
- [ ] **DocumentUpload.tsx** - Blue upload buttons
- [ ] **PDSPrintView.tsx** - Print styles

### Shared Styles Applied
- **Shadows**: 
  - Default: `shadow-md`
  - Hover: `shadow-lg` or `shadow-xl`
  - Transitions: `transition-all duration-200` or `duration-300`

- **Borders**:
  - Primary: `border-gray-200` with `rounded-lg` or `rounded-xl`
  - Focus: Blue rings `focus:ring-2 focus:ring-blue-500`

- **Hover States**:
  - Buttons: `hover:opacity-90`, lift effect `hover:-translate-y-0.5`
  - Cards: `hover:shadow-lg`, subtle color changes
  - Links: `hover:text-blue-700`

- **Icons**:
  - Primary icons: `text-blue-600`
  - Secondary icons: `text-gray-600`
  - White icons on blue: `text-white`
  - Accent icons: `text-yellow-500` or `text-yellow-600`

## Implementation Guidelines

1. **Never change** functionality or HTML structure
2. **Always update** color variables, not hardcoded colors
3. **Use Tailwind classes** exclusively (no custom CSS unless necessary)
4. **Maintain responsive** classes (`sm:`, `md:`, `lg:`)
5. **Test accessibility** - Ensure proper contrast ratios
6. **Add transitions** for smooth UX
7. **Update related** components together (button + form + table)

## Testing Checklist
- [ ] All text is readable (contrast ratio >= 4.5:1)
- [ ] Buttons have active/hover states
- [ ] Forms show proper focus states
- [ ] Mobile responsiveness maintained
- [ ] Icons display correctly with new colors
- [ ] Shadows render cleanly
- [ ] Color consistency across all pages
