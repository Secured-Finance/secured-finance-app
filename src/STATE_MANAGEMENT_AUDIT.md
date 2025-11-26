# State Management Audit - ISSUE-037

## Overview
This document analyzes the current state management systems in the Secured Finance application and provides a migration plan to consolidate to React Query (data) + Zustand (UI) as outlined in EPIC-004.

## Current State Management Systems

### 1. Redux (Redux Toolkit) Usage

**Store Structure** (`src/store/index.ts`):
- `blockchain` - Chain information and errors
- `interactions` - UI state (wallet dialog open/close)
- `landingOrderForm` - Landing page order form state
- `lastError` - Error handling
- `wallet` - Basic wallet state (address, balance)

**Redux Slices Analysis**:

#### Wallet Slice (`src/store/wallet/reducer.ts`)
- **Purpose**: Basic wallet connection state
- **State**: address, balance
- **Actions**: connectWallet, updateBalance, resetWallet
- **Migration Difficulty**: Low - can be replaced with Zustand
- **Usage**: Limited, mostly superseded by wagmi hooks

#### Interactions Slice (`src/store/interactions/reducer.ts`)
- **Purpose**: UI state management
- **State**: walletDialogOpen (boolean)
- **Actions**: setWalletDialogOpen
- **Migration Difficulty**: Low - perfect candidate for Zustand

#### Blockchain Slice
- **Purpose**: Chain information, errors, latest block
- **Usage**: Core infrastructure, used throughout app
- **Migration Difficulty**: Medium - needs careful transition

#### Landing Order Form Slice
- **Purpose**: Form state for landing page
- **Migration Difficulty**: Low - can use Zustand or form libraries

#### Last Error Slice
- **Purpose**: Global error state
- **Migration Difficulty**: Medium - needs error handling strategy

**Files Using Redux**: 60 files found with Redux imports/usage

### 2. Apollo GraphQL Client Usage

**Current Status**: 
- **Minimal Usage**: Only 2 files actively using Apollo Client
- **Primary File**: `src/hooks/useYieldCurveHistoricalRates/useYieldCurveHistoricalRates.ts`
- **App Setup**: `src/pages/_app.tsx` includes ApolloProvider
- **Migration Difficulty**: Low - very limited usage

**Analysis**:
- Most GraphQL operations have already been migrated to React Query
- Only historical rates hook still uses Apollo
- Package is still included but underutilized

### 3. React Context Usage

**Current Implementation**: 
- **Primary Context**: `SecuredFinanceProvider` in `src/contexts/SecuredFinanceProvider/`
- **Purpose**: Provides SecuredFinanceClient instance across app
- **Usage**: 1 context consumer (`useSecuredFinance.ts`)
- **Migration Difficulty**: Low - well-contained, single-purpose context

**Context Analysis**:
- Well-designed, focused context for SDK access
- No performance issues or unnecessary re-renders
- Can remain as-is or migrate to Zustand if needed

### 4. React Query Usage

**Current Status**: 
- **Extensive Usage**: 33 files using React Query
- **Primary Purpose**: Data fetching and caching
- **Implementation**: Modern @tanstack/react-query implementation
- **Status**: Already aligned with target architecture

**Key Hooks Using React Query**:
- `usePositions` - Position management
- `useOrderList` - Order data
- `useBalances` - Balance queries  
- `useLendingMarkets` - Market data
- `useOrderbook` - Orderbook data
- And many more...

### 5. Additional State Management

**Local State**: 
- Standard React useState in components
- Form libraries for complex forms
- No consolidation needed

## Migration Plan

### Phase 1: Zustand Setup (Week 1)
1. **Install Zustand**: Add zustand package
2. **Create UI Store**: Migrate `interactions` slice
   - `walletDialogOpen` state
   - Simple boolean toggles
3. **Test Integration**: Ensure no regressions

### Phase 2: Redux Migration (Week 2-3)
1. **Wallet State**: 
   - Migrate to Zustand or rely on wagmi completely
   - Most wallet state already handled by wagmi hooks
2. **Blockchain State**:
   - Keep essential chain information in Zustand
   - Chain errors, latest block number
3. **Form State**:
   - Landing order form → Zustand or form library
   - Consider react-hook-form for complex forms
4. **Error Handling**:
   - Global error state → Zustand
   - Integrate with error boundaries

### Phase 3: Apollo Removal (Week 2)
1. **Migrate Historical Rates**: 
   - Convert `useYieldCurveHistoricalRates` to use React Query
   - Use graphql-request or fetch directly
2. **Remove Apollo**: 
   - Remove @apollo/client dependency
   - Clean up ApolloProvider from _app.tsx

### Phase 4: Context Optimization (Week 3)
1. **SecuredFinance Context**:
   - Evaluate if migration to Zustand provides benefits
   - Current implementation is efficient - may not need changes
2. **Performance Review**: 
   - Audit for unnecessary re-renders
   - Optimize context value creation

### Phase 5: Testing & Validation (Week 4)
1. **Unit Tests**: Update tests for new state management
2. **Integration Tests**: Verify data flow
3. **Performance Testing**: Ensure no regressions
4. **Documentation**: Update team documentation

## Target Architecture

### Data Layer (React Query)
- **Purpose**: Server state management, caching, synchronization
- **Current Status**: ✅ Already implemented extensively
- **Usage**: All API calls, contract reads, subgraph queries

### UI State Layer (Zustand)
- **Purpose**: Client-side UI state, form state, global app state
- **Target State**:
  - Modal/dialog states (walletDialogOpen, etc.)
  - Form state (order forms, settings)
  - UI preferences (theme, language)
  - Error states
  - Chain/network state

### Context Layer (Minimal)
- **Purpose**: Dependency injection, provider patterns
- **Retained**: SecuredFinanceProvider (if beneficial)
- **Philosophy**: Use sparingly, only for true dependency injection

## Risk Assessment

### Low Risk
- ✅ Apollo removal (minimal usage)
- ✅ Interactions slice migration
- ✅ Form state migration

### Medium Risk
- ⚠️ Blockchain state migration (widely used)
- ⚠️ Error handling consolidation
- ⚠️ Testing coverage during migration

### High Risk
- 🔴 Breaking changes during transition
- 🔴 Performance regressions
- 🔴 State synchronization issues

## Migration Timeline

**Total Estimated Time**: 3-4 weeks
**Estimated LOC Changes**: <200 LOC (as per requirement)

### Week 1
- Zustand setup and basic UI state migration
- Apollo GraphQL removal

### Week 2  
- Redux wallet and interactions migration
- Form state consolidation

### Week 3
- Blockchain state migration
- Context optimization
- Error handling updates

### Week 4
- Testing and validation
- Documentation updates
- Performance optimization

## Success Criteria

1. **Reduced Complexity**: From 5 state systems to 2 (React Query + Zustand)
2. **Maintained Performance**: No regressions in app performance
3. **Test Coverage**: All tests passing, new tests for Zustand stores
4. **Bundle Size**: Reduced bundle size from removing Apollo and Redux
5. **Developer Experience**: Simpler state management patterns

## Next Steps

1. **Get approval** for this migration plan
2. **Set up feature flags** for gradual migration
3. **Create Zustand stores** for UI state
4. **Begin with lowest-risk migrations** (interactions, forms)
5. **Establish testing strategy** for each phase

---

**Document**: STATE_MANAGEMENT_AUDIT.md  
**Epic**: EPIC-004  
**Issue**: ISSUE-037  
**Created**: 2024-08-25  
**Status**: Ready for Review