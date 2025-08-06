# @dojoengine/internal

Internal APIs for Dojo Engine packages. This package contains private implementations that are shared across the Dojo SDK but are not intended for direct external use.

## Purpose

This package centralizes internal utilities and core functionality used by other Dojo packages, particularly `@dojoengine/sdk`. It includes:

- Entity parsing and management
- Query builders
- Type definitions
- Token management utilities
- SDK creation logic

## ⚠️ Important Notice

This package is **internal** and its APIs are **not stable**. They may change without notice between releases. External projects should not depend on this package directly. Instead, use the public APIs exposed through `@dojoengine/sdk`.

## Usage

This package is automatically installed as a dependency of `@dojoengine/sdk`. You should not need to install it directly.

## For Maintainers

When modifying this package, ensure that:
1. All changes are backward compatible with existing SDK functionality
2. Tests in dependent packages still pass
3. Type definitions remain consistent