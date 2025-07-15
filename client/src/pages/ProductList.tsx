// src/pages/ProductList.tsx
import{
  useState,
  useEffect,
  useCallback,
  useRef,
  memo,
} from "react";
import type { KeyboardEvent, Dispatch, SetStateAction, FC } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Filter, Grid, List, X, ChevronDown } from "lucide-react";
import axios from "axios";
import ProductCard from "../components/ProductCard";

/* ------------------------------------------------------------------ */
/*  types                                                             */
/* ------------------------------------------------------------------ */
interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  sizes: string[];
  colors: string[];
  colorImages: { color: string; imageUrl: string }[];
  imageUrl: string;
  stock: number;
  gender: "Men" | "Women" | "Unisex";
  inStock: boolean;
  stockStatus: string;
  categories?: string[];
}

interface Category {
  _id: string;
  name: string;
}

interface FetchParams {
  search?: string;
  category?: string;
  size?: string;
  color?: string;
  gender?: string;
  inStock?: string;
}

/* ------------------------------------------------------------------ */
/*  FilterSidebar (hoisted & memoised)                                */
/* ------------------------------------------------------------------ */
interface FilterSidebarProps {
  /** data */
  categories: Category[];
  availableColors: string[];
  availableSizes: string[];

  /** search */
  searchInput: string;
  appliedSearch: string;
  setSearchInput: Dispatch<SetStateAction<string>>;
  executeSearch: () => void;
  handleSearchKeyPress: (e: KeyboardEvent<HTMLInputElement>) => void;
  clearSearchOnly: () => void;
  loading: boolean;

  /** filters */
  selectedCategory: string;
  setSelectedCategory: Dispatch<SetStateAction<string>>;
  selectedSize: string;
  setSelectedSize: Dispatch<SetStateAction<string>>;
  selectedColor: string;
  setSelectedColor: Dispatch<SetStateAction<string>>;
  selectedGender: string;
  setSelectedGender: Dispatch<SetStateAction<string>>;
  showInStockOnly: boolean;
  setShowInStockOnly: Dispatch<SetStateAction<boolean>>;

  /** utils */
  clearFilters: () => void;
  hasActiveFilters: any;
  isFilterOpen: boolean;
  setIsFilterOpen: Dispatch<SetStateAction<boolean>>;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

const FilterSidebar: FC<FilterSidebarProps> = memo(
  ({
    categories,
    availableColors,
    availableSizes,
    searchInput,
    appliedSearch,
    setSearchInput,
    executeSearch,
    handleSearchKeyPress,
    clearSearchOnly,
    loading,
    selectedCategory,
    setSelectedCategory,
    selectedSize,
    setSelectedSize,
    selectedColor,
    setSelectedColor,
    selectedGender,
    setSelectedGender,
    showInStockOnly,
    setShowInStockOnly,
    clearFilters,
    hasActiveFilters,
    isFilterOpen,
    setIsFilterOpen,
    inputRef,
  }) => (
    <div className={`${isFilterOpen ? "block" : "hidden"} lg:block lg:w-80 space-y-6`}>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
        {/* header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-playfair font-bold text-stone-800">Filters</h3>
          <button
            onClick={() => setIsFilterOpen(false)}
            className="lg:hidden p-2 hover:bg-stone-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* search --------------------------------------------------- */}
          <div>
            <label className="block text-sm font-cormorant font-semibold text-stone-700 mb-3">
              Search Products
            </label>
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Type to search products..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                  className="w-full pl-10 pr-10 py-3 border border-stone-300 rounded-lg focus:outline-none focus:border-stone-500 focus:ring-2 focus:ring-stone-200 font-cormorant transition-all"
                />
                {searchInput && (
                  <button
                    onClick={clearSearchOnly}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-stone-100 rounded-full transition-colors"
                  >
                    <X className="h-4 w-4 text-stone-400" />
                  </button>
                )}
              </div>

              {/* search button */}
              <button
                onClick={executeSearch}
                disabled={loading}
                className="w-full bg-stone-800 text-white py-3 rounded-lg hover:bg-stone-700 disabled:opacity-50 transition-colors font-cormorant font-semibold flex items-center justify-center space-x-2"
              >
                <Search className="h-4 w-4" />
                <span>{loading ? "Searching..." : "Search"}</span>
              </button>

              <p className="text-xs text-stone-500 font-cormorant text-center">
                Press Enter or click Search button
              </p>

              {appliedSearch && (
                <div className="bg-stone-50 rounded-lg p-3 border border-stone-200">
                  <p className="text-sm font-cormorant text-stone-700">
                    <span className="font-semibold">Searching for:</span> "{appliedSearch}"
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* category ------------------------------------------------- */}
          <div>
            <label className="block text-sm font-cormorant font-semibold text-stone-700 mb-3">
              Category
            </label>
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:border-stone-500 transition-colors font-cormorant appearance-none bg-white"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 pointer-events-none" />
            </div>
          </div>

          {/* gender --------------------------------------------------- */}
          <div>
            <label className="block text-sm font-cormorant font-semibold text-stone-700 mb-3">
              Gender
            </label>
            <div className="space-y-2">
              {["Unisex"].map((g) => (
                <label key={g} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    checked={selectedGender === g}
                    onChange={(e) => setSelectedGender(e.target.value)}
                    className="w-4 h-4 text-stone-600 border-stone-300 focus:ring-stone-500"
                  />
                  <span className="ml-3 font-cormorant text-stone-700">{g}</span>
                </label>
              ))}
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value=""
                  checked={selectedGender === ""}
                  onChange={(e) => setSelectedGender(e.target.value)}
                  className="w-4 h-4 text-stone-600 border-stone-300 focus:ring-stone-500"
                />
                <span className="ml-3 font-cormorant text-stone-700">All</span>
              </label>
            </div>
          </div>

          {/* size ----------------------------------------------------- */}
          <div>
            <label className="block text-sm font-cormorant font-semibold text-stone-700 mb-3">
              Size
            </label>
            <div className="grid grid-cols-3 gap-2">
              {availableSizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(selectedSize === s ? "" : s)}
                  className={`py-2 px-3 border rounded-lg text-sm font-cormorant transition-colors ${
                    selectedSize === s
                      ? "border-stone-800 bg-stone-800 text-white"
                      : "border-stone-300 hover:border-stone-500"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* color ---------------------------------------------------- */}
          <div>
            <label className="block text-sm font-cormorant font-semibold text-stone-700 mb-3">
              Color
            </label>
            <div className="grid grid-cols-2 gap-2">
              {availableColors.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedColor(selectedColor === c ? "" : c)}
                  className={`py-2 px-3 border rounded-lg text-sm font-cormorant transition-colors ${
                    selectedColor === c
                      ? "border-stone-800 bg-stone-800 text-white"
                      : "border-stone-300 hover:border-stone-500"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* stock ---------------------------------------------------- */}
          <div>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showInStockOnly}
                onChange={(e) => setShowInStockOnly(e.target.checked)}
                className="w-4 h-4 text-stone-600 border-stone-300 focus:ring-stone-500 rounded"
              />
              <span className="ml-3 font-cormorant text-stone-700">In Stock Only</span>
            </label>
          </div>

          {/* clear filters ------------------------------------------- */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="w-full py-3 bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200 transition-colors font-cormorant font-semibold"
            >
              Clear All Filters
            </button>
          )}
        </div>
      </div>
    </div>
  )
);
FilterSidebar.displayName = "FilterSidebar"; // for React DevTools

/* ------------------------------------------------------------------ */
/*  ProductList (unchanged UI, fixed focus)                           */
/* ------------------------------------------------------------------ */
const ProductList: FC = () => {
  /* ----------------------------- state --------------------------- */
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [availableColors, setAvailableColors] = useState<string[]>([]);
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [searchInput, setSearchInput] = useState<string>("");
  const [appliedSearch, setAppliedSearch] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedGender, setSelectedGender] = useState<string>("");
  const [showInStockOnly, setShowInStockOnly] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  /* ------------------------- initial params ---------------------- */
  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    const urlCategory = searchParams.get("category") || "";
    const urlSize = searchParams.get("size") || "";
    const urlColor = searchParams.get("color") || "";
    const urlGender = searchParams.get("gender") || "";
    const urlInStock = searchParams.get("inStock") === "true";

    setSearchInput(urlSearch);
    setAppliedSearch(urlSearch);
    setSelectedCategory(urlCategory);
    setSelectedSize(urlSize);
    setSelectedColor(urlColor);
    setSelectedGender(urlGender);
    setShowInStockOnly(urlInStock);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once

  /* ------------------------- fetch products ---------------------- */
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params: FetchParams = {};
    if (appliedSearch.trim()) params.search = appliedSearch.trim();
    if (selectedCategory) params.category = selectedCategory;
    if (selectedSize) params.size = selectedSize;
    if (selectedColor) params.color = selectedColor;
    if (selectedGender) params.gender = selectedGender;
    if (showInStockOnly) params.inStock = "true";

    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/products`, {
        params,
      });
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [
    appliedSearch,
    selectedCategory,
    selectedSize,
    selectedColor,
    selectedGender,
    showInStockOnly,
  ]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  /* ------------------ fetch categories & filter opts ------------- */
  useEffect(() => {
    Promise.all([
      axios.get(`${import.meta.env.VITE_API_BASE_URL}/categories`),
      axios.get(`${import.meta.env.VITE_API_BASE_URL}/products/filters/options`),
    ])
      .then(([categoriesRes, filtersRes]) => {
        setCategories(categoriesRes.data);
        setAvailableColors(filtersRes.data.colors || []);
        setAvailableSizes(filtersRes.data.sizes || []);
      })
      .catch((err) => console.error("Error fetching filter options:", err));
  }, []);

  /* ------------------------- sync URL params --------------------- */
  useEffect(() => {
    const params = new URLSearchParams();
    if (appliedSearch.trim()) params.set("search", appliedSearch.trim());
    if (selectedCategory) params.set("category", selectedCategory);
    if (selectedSize) params.set("size", selectedSize);
    if (selectedColor) params.set("color", selectedColor);
    if (selectedGender) params.set("gender", selectedGender);
    if (showInStockOnly) params.set("inStock", "true");
    setSearchParams(params, { replace: true });
  }, [
    appliedSearch,
    selectedCategory,
    selectedSize,
    selectedColor,
    selectedGender,
    showInStockOnly,
    setSearchParams,
  ]);

  /* --------------------------- handlers -------------------------- */
  const executeSearch = () => {
    setAppliedSearch(searchInput);
    inputRef.current?.focus();
  };

  const handleSearchKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      executeSearch();
    }
  };

  const clearSearchOnly = () => {
    setSearchInput("");
    setAppliedSearch("");
    inputRef.current?.focus();
  };

  const clearFilters = () => {
    setSearchInput("");
    setAppliedSearch("");
    setSelectedCategory("");
    setSelectedSize("");
    setSelectedColor("");
    setSelectedGender("");
    setShowInStockOnly(false);
  };

  /* ------------------------- derived ----------------------------- */
  const hasActiveFilters =
    appliedSearch ||
    selectedCategory ||
    selectedSize ||
    selectedColor ||
    selectedGender ||
    showInStockOnly;

  /* ---------------------------- UI ------------------------------- */
  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* header --------------------------------------------------- */}
        <div className="relative mb-12">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-2 h-2 bg-stone-800 rounded-full" />
              <span className="text-sm font-cormorant font-medium text-stone-600 tracking-wider uppercase">
                Premium Collection
              </span>
              <div className="w-2 h-2 bg-stone-800 rounded-full" />
            </div>
            <h1 className="text-5xl font-playfair font-bold mb-4 text-stone-800">
              Our <span className="text-stone-600">Products</span>
            </h1>
            <p className="text-stone-600 text-xl max-w-2xl mx-auto font-cormorant">
              Discover handcrafted pieces where traditional techniques meet
              contemporary elegance.
            </p>
          </div>

          {/* controls ---------------------------------------------- */}
          <div className="absolute top-0 right-0 flex items-center space-x-4">
            {/* view toggle */}
            <div className="hidden md:flex items-center space-x-2 bg-stone-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "grid" ? "bg-white shadow-sm" : "hover:bg-stone-200"
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "list" ? "bg-white shadow-sm" : "hover:bg-stone-200"
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            {/* filter toggle (mobile) */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="lg:hidden flex items-center space-x-2 bg-stone-800 text-white px-4 py-2 rounded-lg hover:bg-stone-700 transition-colors"
            >
              <Filter className="h-4 w-4" />
              <span className="font-cormorant">Filters</span>
            </button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* sidebar (desktop) ------------------------------------- */}
          <FilterSidebar
            /* data */
            categories={categories}
            availableColors={availableColors}
            availableSizes={availableSizes}
            /* search */
            searchInput={searchInput}
            appliedSearch={appliedSearch}
            setSearchInput={setSearchInput}
            executeSearch={executeSearch}
            handleSearchKeyPress={handleSearchKeyPress}
            clearSearchOnly={clearSearchOnly}
            loading={loading}
            /* filters */
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            selectedGender={selectedGender}
            setSelectedGender={setSelectedGender}
            showInStockOnly={showInStockOnly}
            setShowInStockOnly={setShowInStockOnly}
            /* utils */
            clearFilters={clearFilters}
            hasActiveFilters={hasActiveFilters}
            isFilterOpen={isFilterOpen}
            setIsFilterOpen={setIsFilterOpen}
            inputRef={inputRef}
          />

          {/* main list ------------------------------------------- */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-stone-300 border-t-stone-800 rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-stone-600 font-cormorant text-lg">
                    {appliedSearch
                      ? `Searching for "${appliedSearch}"...`
                      : "Loading products..."}
                  </p>
                </div>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <div className="bg-stone-50 rounded-2xl p-16 max-w-2xl mx-auto">
                  <div className="w-24 h-24 bg-stone-200 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="h-12 w-12 text-stone-400" />
                  </div>
                  <h3 className="text-2xl font-playfair font-bold text-stone-800 mb-4">
                    No products found
                  </h3>
                  <p className="text-stone-600 font-cormorant text-lg mb-8">
                    {appliedSearch
                      ? `No products found for "${appliedSearch}". Try adjusting your search or filters.`
                      : "Try adjusting your search or filter criteria to discover more amazing pieces."}
                  </p>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="bg-stone-800 text-white px-6 py-3 rounded-lg hover:bg-stone-700 transition-colors font-cormorant"
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <>
                {/* results header ----------------------------------- */}
                <div className="mb-8 flex justify-between items-center bg-stone-50 rounded-xl p-4">
                  <p className="text-stone-600 font-cormorant">
                    Showing{" "}
                    <span className="font-semibold text-stone-800">{products.length}</span>{" "}
                    {products.length === 1 ? "product" : "products"}
                    {appliedSearch && (
                      <span>
                        {" "}
                        for "<span className="font-semibold">{appliedSearch}</span>"
                      </span>
                    )}
                  </p>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-stone-600 hover:text-stone-800 underline font-cormorant transition-colors"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>

                {/* grid / list ------------------------------------- */}
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8"
                      : "space-y-6"
                  }
                >
                  {products.map((p) => (
                    <ProductCard key={p._id} product={p} viewMode={viewMode} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* mobile overlay ------------------------------------------- */}
      {isFilterOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="fixed inset-y-0 left-0 w-80 bg-white overflow-y-auto">
            <div className="p-6">
              <FilterSidebar
                /* same props */
                categories={categories}
                availableColors={availableColors}
                availableSizes={availableSizes}
                searchInput={searchInput}
                appliedSearch={appliedSearch}
                setSearchInput={setSearchInput}
                executeSearch={executeSearch}
                handleSearchKeyPress={handleSearchKeyPress}
                clearSearchOnly={clearSearchOnly}
                loading={loading}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedSize={selectedSize}
                setSelectedSize={setSelectedSize}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                selectedGender={selectedGender}
                setSelectedGender={setSelectedGender}
                showInStockOnly={showInStockOnly}
                setShowInStockOnly={setShowInStockOnly}
                clearFilters={clearFilters}
                hasActiveFilters={hasActiveFilters}
                isFilterOpen={isFilterOpen}
                setIsFilterOpen={setIsFilterOpen}
                inputRef={inputRef}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
