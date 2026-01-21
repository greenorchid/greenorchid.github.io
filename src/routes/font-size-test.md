# Font Size Component Test

The FontSizePopover component has been created and integrated into the layout. Here's what it provides:

## Features

### **Main Button**

- **Position**: Fixed top-4, right-54 (left of ReducedMotionToggle at right-18)
- **Size**: Same as ReducedMotionToggle (40px × 40px)
- **Icon**: "Aa" text representing font size
- **Current scale indicator**: Shows percentage on hover

### **Popover Interface**

- **Current scale display**: Shows current percentage (e.g., 100%)
- **Preset buttons**: Quick access to 80%, 90%, 100%, 110%, 120%, 130%
- **Manual controls**: Decrease/Increase buttons with icons
- **Reset button**: Return to 100% default
- **Range limits**: 80% minimum, 150% maximum

### **Technical Implementation**

#### **CSS Integration**

- Uses existing `--font-scale` CSS variable in layout.css
- Updates `document.documentElement.style.setProperty('--font-scale')`
- Smooth transitions for all text elements

#### **Persistence**

- Saves preference to localStorage as 'font-scale'
- Loads saved scale on component mount
- Updates in real-time

#### **Accessibility**

- Proper ARIA labels and roles
- Keyboard navigation support
- Screen reader announcements
- High contrast mode compatible

### **Usage**

The component is automatically available in the top-right corner of your site:

1. Click the "Aa" button to open the font size popover
2. Select from preset buttons (80%-130%) or use manual controls
3. Font size changes apply immediately across the entire site
4. Preference is saved for future visits

### **Mobile Responsive**

- Touch-friendly button sizes
- Proper popover positioning on small screens
- Works with both touch and mouse input

The font scale affects all text elements including headings, paragraphs, and UI components while maintaining site layout and responsiveness.
