# Handlebars Partials Documentation

This directory contains reusable Handlebars partials organized by category. The partials have been reorganized for better maintainability and consistency.

## Recent Changes (November 2025)

- **Reorganization**: All partials moved from flat structure to organized subfolders
- **Registration**: Updated Express Handlebars configuration to support subfolder prefixes
- **Consistency**: Standardized partial naming and folder structure
- **Documentation**: Comprehensive documentation added for all partials

## Directory Structure

## Directory Structure

- `navbars/` - Navigation-related partials
- `models/` - Business model templates
- `widgets/` - UI widgets and components
- `lists/` - List and collection components
- `ui/` - General UI elements
- `components/` - Reusable components
- `forms/` - Form input components
- `tables/` - Table-related components

## Available Partials

### Navigation (`navbars/`)

#### `_admin-nav-item.hbs`

Reusable navigation item for admin sidebars.

**Parameters:**

- `href` (string): Link URL
- `icon` (string): Lucide icon name
- `text` (string): Display text
- `active` (boolean): Whether the item is active

**Usage:**

```handlebars
{{> navbars/_admin-nav-item href="/admin/users" icon="Users" text="Users" active=activeUsers}}
```

### Widgets (`widgets/`)

#### `_stat-card.hbs`

Dashboard metric card with icon, value, and trend.

**Parameters:**

- `title` (string): Card title
- `value` (string/number): Display value
- `icon` (string): Lucide icon name
- `bgColor` (string): Background color (e.g., "#E3F2FD")
- `iconBgColor` (string): Icon background color (e.g., "#2196F3")
- `href` (string, optional): Clickable link
- `trendText` (string, optional): Trend text (e.g., "+12% Since last month")
- `trendIcon` (string, optional): Trend icon (default: "TrendingUp")
- `trendColor` (string, optional): Trend color

**Usage:**

```handlebars
{{> widgets/_stat-card title="Total Users" value=stats.users.total icon="Users" bgColor="#E3F2FD" iconBgColor="#2196F3" trendText="+12% Since last month" trendColor="#2196F3"}}
```

#### `_toast.hbs`

Toast notification component.

**Parameters:** None (standalone component)

**Usage:**

```handlebars
{{> widgets/_toast}}
```

### UI Elements (`ui/`)

#### `_modal.hbs`

Modal dialog with backdrop.

**Parameters:**

- `id` (string): Unique modal ID
- `title` (string): Modal title
- `content` (string): Modal body content (HTML)
- `size` (string, optional): Modal size (default: "md")
- `footer` (string, optional): Modal footer content (HTML)
- `onClose` (string, optional): JavaScript to run on close

**Usage:**

```handlebars
{{> ui/_modal id="edit-user" title="Edit User" content="<p>Edit form here</p>" size="lg"}}
```

#### `_pagination.hbs`

Page navigation component.

**Parameters:**

- `currentPage` (number): Current page number
- `totalPages` (number): Total number of pages
- `baseUrl` (string): Base URL for pagination links
- `queryParams` (string, optional): Additional query parameters
- `pages` (array, optional): Array of page numbers to display

**Usage:**

```handlebars
{{> ui/_pagination currentPage=currentPage totalPages=totalPages baseUrl="/admin/users" queryParams="?role=admin"}}
```

#### `_action-menu.hbs`

Dropdown action menu.

**Parameters:**

- `menuId` (string): Unique menu ID
- `actions` (array): Array of action objects with `text`, `icon`, `href` or `onclick`

**Usage:**

```handlebars
{{> ui/_action-menu menuId="user-actions" actions=actions}}
```

#### `_bulk-actions.hbs`

Bulk action bar for selected items.

**Parameters:**

- `selectedCount` (number): Number of selected items
- `actions` (array): Array of action objects with `text`, `icon`, `onclick`

**Usage:**

```handlebars
{{> ui/_bulk-actions selectedCount=selectedCount actions=bulkActions}}
```

#### `_user-profile-dropdown.hbs`

User profile dropdown menu.

**Parameters:**

- `dropdownId` (string): Unique dropdown ID
- `user` (object): User object with `firstName`, `lastName`, `email`, `role`
- `menuItems` (array): Array of menu items with `text`, `icon`, `href` or `onclick`, or `divider`

**Usage:**

```handlebars
{{> ui/_user-profile-dropdown dropdownId="user-menu" user=user menuItems=menuItems}}
```

### Tables (`tables/`)

#### `_user-table-row.hbs`

User table row with actions.

**Parameters:**

- `user` (object): User data object
- `actions` (array): Array of action objects

**Usage:**

```handlebars
{{> tables/_user-table-row user=user actions=actions}}
```

### Forms (`forms/`)

#### `_form-input.hbs`

Form input field with label and validation.

**Parameters:**

- `id` (string): Input ID and name
- `label` (string): Field label
- `type` (string, optional): Input type (default: "text")
- `value` (string, optional): Input value
- `placeholder` (string, optional): Placeholder text
- `required` (boolean, optional): Whether field is required
- `error` (string, optional): Error message

**Usage:**

```handlebars
{{> forms/_form-input id="email" label="Email Address" type="email" required=true}}
```

#### `_form-select.hbs`

Form select dropdown.

**Parameters:**

- `id` (string): Select ID and name
- `label` (string): Field label
- `options` (array): Array of option objects with `value` and `text`
- `selected` (string, optional): Selected value
- `required` (boolean, optional): Whether field is required
- `error` (string, optional): Error message

**Usage:**

```handlebars
{{> forms/_form-select id="role" label="User Role" options=roleOptions selected=user.role required=true}}
```

#### `_form-textarea.hbs`

Form textarea field.

**Parameters:**

- `id` (string): Textarea ID and name
- `label` (string): Field label
- `rows` (number, optional): Number of rows (default: 3)
- `value` (string, optional): Textarea value
- `placeholder` (string, optional): Placeholder text
- `required` (boolean, optional): Whether field is required
- `error` (string, optional): Error message

**Usage:**

```handlebars
{{> forms/_form-textarea id="description" label="Description" rows=5 required=true}}
```

### Components (`components/`)

#### `_quick-action-card.hbs`

Quick action card for dashboards.

**Parameters:**

- `href` (string): Link URL
- `icon` (string): Lucide icon name
- `title` (string): Card title
- `description` (string): Card description

**Usage:**

```handlebars
{{> components/_quick-action-card href="/admin/users" icon="Users" title="Manage Users" description="View and manage user accounts"}}
```

## Notes

- All partials follow consistent naming with leading underscore
- Icons use Lucide icon names
- Colors should use hex codes for consistency
- Boolean parameters can be passed as `param=true` or just `param` (truthy)
- Optional parameters can be omitted
