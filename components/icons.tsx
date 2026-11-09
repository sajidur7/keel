import type { LucideIcon, LucideProps } from "lucide-react";
import { createContext, forwardRef, useContext } from "react";
import {
  Activity,
  Archive,
  ArrowDown,
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpDown,
  ArrowUpRight,
  Bell,
  Building2,
  Calendar,
  ChartColumn,
  ChartLine,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUpDown,
  CircleAlert,
  CircleCheck,
  CircleHelp,
  CircleX,
  Clock,
  Code,
  Columns3,
  Command,
  Copy,
  CornerDownLeft,
  CreditCard,
  Database,
  Dot,
  Download,
  Ellipsis,
  EllipsisVertical,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  Flag,
  Folder,
  Globe,
  GripVertical,
  History,
  House,
  Image,
  Inbox,
  Info,
  KeyRound,
  LayoutGrid,
  Link,
  List,
  ListFilter,
  LoaderCircle,
  Lock,
  LockOpen,
  LogOut,
  Mail,
  Menu,
  Minus,
  Moon,
  Package,
  PanelLeft,
  PanelRight,
  Pause,
  Pencil,
  Phone,
  Play,
  Plus,
  Receipt,
  RefreshCw,
  Search,
  Server,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Star,
  Sun,
  Tag,
  Terminal,
  Trash2,
  TriangleAlert,
  Upload,
  User,
  UserPlus,
  Users,
  Webhook,
  WifiOff,
  X,
  Zap,
  Accessibility,
  AtSign,
  Award,
  Bold,
  BookOpen,
  Bookmark,
  Bot,
  Brain,
  Bug,
  Circle,
  CircleDashed,
  CircleDot,
  ClipboardList,
  Cloud,
  Coffee,
  Columns2,
  Compass,
  Cpu,
  DollarSign,
  Feather,
  FileCode2,
  FileImage,
  FilePlus2,
  Fingerprint,
  Flame,
  Gauge,
  GitBranch,
  Hash,
  Heading2,
  Heart,
  Italic,
  Keyboard,
  Languages,
  Layers,
  Leaf,
  Lightbulb,
  ListOrdered,
  Map,
  Maximize2,
  Megaphone,
  MessageSquare,
  Mic,
  Minimize2,
  MousePointer2,
  Music,
  Palette,
  Paperclip,
  Percent,
  Pin,
  Quote,
  Radio,
  Redo2,
  Rocket,
  Scale,
  SendHorizontal,
  Settings2,
  Shapes,
  Share2,
  ShoppingCart,
  Sigma,
  Smile,
  Sparkles,
  Square,
  SquareKanban,
  Store,
  Strikethrough,
  Table2,
  Target,
  ThumbsDown,
  ThumbsUp,
  Timer,
  TrendingDown,
  TrendingUp,
  Truck,
  Type,
  Underline,
  Undo2,
  Video,
  Wallet,
  Workflow,
  Wrench,
  ZoomIn,
} from "lucide-react";

/*
  Keel icons are Lucide (https://lucide.dev), configured for dense admin UI:
  - 16px by default, 14px inside small controls (size={14}).
  - absoluteStrokeWidth at 1.5px, so the stroke stays 1.5px at every size instead of
    scaling with Lucide's 24px grid. That keeps icons as light as 12–14px text beside them.
  - Decorative by default (aria-hidden). Pass `label` when the icon is the only content.

  Keel's own names (IconSearch, IconTrash…) map to Lucide icons below, so components never
  import Lucide directly. Need another Lucide icon? Wrap it once:
    import { Truck } from "lucide-react";
    export const IconTruck = keelIcon(Truck);
*/
export type IconProps = Omit<LucideProps, "ref" | "size"> & {
  size?: number;
  /** Accessible name. Without it the icon is decorative (aria-hidden). */
  label?: string;
};

/** Controls (Button, Input, Menu item…) set the icon size for icons inside them. */
export const IconSizeContext = createContext<number | undefined>(undefined);

export function keelIcon(Lucide: LucideIcon, name = Lucide.displayName ?? "Icon") {
  const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon({ size, label, strokeWidth = 1.5, ...props }, ref) {
    const ctx = useContext(IconSizeContext);
    return (
      <Lucide
        ref={ref}
        size={size ?? ctx ?? 16}
        strokeWidth={strokeWidth}
        absoluteStrokeWidth
        role={label ? "img" : undefined}
        aria-label={label}
        aria-hidden={label ? undefined : true}
        focusable="false"
        {...props}
      />
    );
  });
  Icon.displayName = `Keel(${name})`;
  return Icon;
}

export const IconPlus = keelIcon(Plus, "plus");
export const IconMinus = keelIcon(Minus, "minus");
export const IconX = keelIcon(X, "x");
export const IconCheck = keelIcon(Check, "check");
export const IconSearch = keelIcon(Search, "search");
export const IconEdit = keelIcon(Pencil, "pencil");
export const IconTrash = keelIcon(Trash2, "trash-2");
export const IconCopy = keelIcon(Copy, "copy");
export const IconLink = keelIcon(Link, "link");
export const IconExternal = keelIcon(ExternalLink, "external-link");
export const IconUpload = keelIcon(Upload, "upload");
export const IconDownload = keelIcon(Download, "download");
export const IconRefresh = keelIcon(RefreshCw, "refresh-cw");
export const IconFilter = keelIcon(ListFilter, "list-filter");
export const IconSliders = keelIcon(SlidersHorizontal, "sliders-horizontal");
export const IconSort = keelIcon(ArrowUpDown, "arrow-up-down");
export const IconColumns = keelIcon(Columns3, "columns-3");
export const IconMoreHorizontal = keelIcon(Ellipsis, "ellipsis");
export const IconMoreVertical = keelIcon(EllipsisVertical, "ellipsis-vertical");
export const IconGrip = keelIcon(GripVertical, "grip-vertical");
export const IconLogOut = keelIcon(LogOut, "log-out");
export const IconArchive = keelIcon(Archive, "archive");
export const IconChevronDown = keelIcon(ChevronDown, "chevron-down");
export const IconChevronUp = keelIcon(ChevronUp, "chevron-up");
export const IconChevronLeft = keelIcon(ChevronLeft, "chevron-left");
export const IconChevronRight = keelIcon(ChevronRight, "chevron-right");
export const IconChevronsUpDown = keelIcon(ChevronsUpDown, "chevrons-up-down");
export const IconChevronsLeft = keelIcon(ChevronsLeft, "chevrons-left");
export const IconChevronsRight = keelIcon(ChevronsRight, "chevrons-right");
export const IconArrowUp = keelIcon(ArrowUp, "arrow-up");
export const IconArrowDown = keelIcon(ArrowDown, "arrow-down");
export const IconArrowRight = keelIcon(ArrowRight, "arrow-right");
export const IconArrowLeft = keelIcon(ArrowLeft, "arrow-left");
export const IconArrowUpRight = keelIcon(ArrowUpRight, "arrow-up-right");
export const IconArrowDownRight = keelIcon(ArrowDownRight, "arrow-down-right");
export const IconCorner = keelIcon(CornerDownLeft, "corner-down-left");
export const IconInfo = keelIcon(Info, "info");
export const IconAlertTriangle = keelIcon(TriangleAlert, "triangle-alert");
export const IconAlertCircle = keelIcon(CircleAlert, "circle-alert");
export const IconCheckCircle = keelIcon(CircleCheck, "circle-check");
export const IconXCircle = keelIcon(CircleX, "circle-x");
export const IconHelp = keelIcon(CircleHelp, "circle-help");
export const IconLoader = keelIcon(LoaderCircle, "loader-circle");
export const IconWifiOff = keelIcon(WifiOff, "wifi-off");
export const IconLock = keelIcon(Lock, "lock");
export const IconUnlock = keelIcon(LockOpen, "lock-open");
export const IconShield = keelIcon(ShieldCheck, "shield-check");
export const IconEye = keelIcon(Eye, "eye");
export const IconEyeOff = keelIcon(EyeOff, "eye-off");
export const IconStar = keelIcon(Star, "star");
export const IconDot = keelIcon(Dot, "dot");
export const IconHome = keelIcon(House, "house");
export const IconInbox = keelIcon(Inbox, "inbox");
export const IconGrid = keelIcon(LayoutGrid, "layout-grid");
export const IconList = keelIcon(List, "list");
export const IconChartBar = keelIcon(ChartColumn, "chart-column");
export const IconChartLine = keelIcon(ChartLine, "chart-line");
export const IconActivity = keelIcon(Activity, "activity");
export const IconUser = keelIcon(User, "user");
export const IconUsers = keelIcon(Users, "users");
export const IconUserPlus = keelIcon(UserPlus, "user-plus");
export const IconBuilding = keelIcon(Building2, "building-2");
export const IconMail = keelIcon(Mail, "mail");
export const IconPhone = keelIcon(Phone, "phone");
export const IconBell = keelIcon(Bell, "bell");
export const IconSettings = keelIcon(Settings, "settings");
export const IconCalendar = keelIcon(Calendar, "calendar");
export const IconClock = keelIcon(Clock, "clock");
export const IconHistory = keelIcon(History, "history");
export const IconFile = keelIcon(FileText, "file-text");
export const IconFolder = keelIcon(Folder, "folder");
export const IconImage = keelIcon(Image, "image");
export const IconTag = keelIcon(Tag, "tag");
export const IconReceipt = keelIcon(Receipt, "receipt");
export const IconPackage = keelIcon(Package, "package");
export const IconCard = keelIcon(CreditCard, "credit-card");
export const IconGlobe = keelIcon(Globe, "globe");
export const IconCode = keelIcon(Code, "code");
export const IconTerminal = keelIcon(Terminal, "terminal");
export const IconKey = keelIcon(KeyRound, "key-round");
export const IconZap = keelIcon(Zap, "zap");
export const IconMenu = keelIcon(Menu, "menu");
export const IconSidebar = keelIcon(PanelLeft, "panel-left");
export const IconPanelRight = keelIcon(PanelRight, "panel-right");
export const IconCommand = keelIcon(Command, "command");
export const IconSun = keelIcon(Sun, "sun");
export const IconMoon = keelIcon(Moon, "moon");
export const IconPlay = keelIcon(Play, "play");
export const IconPause = keelIcon(Pause, "pause");
export const IconFlag = keelIcon(Flag, "flag");
export const IconDatabase = keelIcon(Database, "database");
export const IconServer = keelIcon(Server, "server");
export const IconWebhook = keelIcon(Webhook, "webhook");

/** Every Keel icon, keyed by its Keel name. Used by the docs icon gallery and the Figma export. */
export const icons = {
  IconPlus, IconMinus, IconX, IconCheck, IconSearch, IconEdit, IconTrash, IconCopy, IconLink, IconExternal, IconUpload, IconDownload, IconRefresh, IconFilter, IconSliders, IconSort, IconColumns, IconMoreHorizontal, IconMoreVertical, IconGrip, IconLogOut, IconArchive, IconChevronDown, IconChevronUp, IconChevronLeft, IconChevronRight, IconChevronsUpDown, IconChevronsLeft, IconChevronsRight, IconArrowUp, IconArrowDown, IconArrowRight, IconArrowLeft, IconArrowUpRight, IconArrowDownRight, IconCorner, IconInfo, IconAlertTriangle, IconAlertCircle, IconCheckCircle, IconXCircle, IconHelp, IconLoader, IconWifiOff, IconLock, IconUnlock, IconShield, IconEye, IconEyeOff, IconStar, IconDot, IconHome, IconInbox, IconGrid, IconList, IconChartBar, IconChartLine, IconActivity, IconUser, IconUsers, IconUserPlus, IconBuilding, IconMail, IconPhone, IconBell, IconSettings, IconCalendar, IconClock, IconHistory, IconFile, IconFolder, IconImage, IconTag, IconReceipt, IconPackage, IconCard, IconGlobe, IconCode, IconTerminal, IconKey, IconZap, IconMenu, IconSidebar, IconPanelRight, IconCommand, IconSun, IconMoon, IconPlay, IconPause, IconFlag, IconDatabase, IconServer, IconWebhook,
} as const;

/** Lucide name behind each Keel icon (for Figma and docs). */
export const lucideNames: Record<keyof typeof icons, string> = {
  IconPlus: "plus", IconMinus: "minus", IconX: "x", IconCheck: "check", IconSearch: "search", IconEdit: "pencil", IconTrash: "trash-2", IconCopy: "copy", IconLink: "link", IconExternal: "external-link", IconUpload: "upload", IconDownload: "download", IconRefresh: "refresh-cw", IconFilter: "list-filter", IconSliders: "sliders-horizontal", IconSort: "arrow-up-down", IconColumns: "columns-3", IconMoreHorizontal: "ellipsis", IconMoreVertical: "ellipsis-vertical", IconGrip: "grip-vertical", IconLogOut: "log-out", IconArchive: "archive", IconChevronDown: "chevron-down", IconChevronUp: "chevron-up", IconChevronLeft: "chevron-left", IconChevronRight: "chevron-right", IconChevronsUpDown: "chevrons-up-down", IconChevronsLeft: "chevrons-left", IconChevronsRight: "chevrons-right", IconArrowUp: "arrow-up", IconArrowDown: "arrow-down", IconArrowRight: "arrow-right", IconArrowLeft: "arrow-left", IconArrowUpRight: "arrow-up-right", IconArrowDownRight: "arrow-down-right", IconCorner: "corner-down-left", IconInfo: "info", IconAlertTriangle: "triangle-alert", IconAlertCircle: "circle-alert", IconCheckCircle: "circle-check", IconXCircle: "circle-x", IconHelp: "circle-help", IconLoader: "loader-circle", IconWifiOff: "wifi-off", IconLock: "lock", IconUnlock: "lock-open", IconShield: "shield-check", IconEye: "eye", IconEyeOff: "eye-off", IconStar: "star", IconDot: "dot", IconHome: "house", IconInbox: "inbox", IconGrid: "layout-grid", IconList: "list", IconChartBar: "chart-column", IconChartLine: "chart-line", IconActivity: "activity", IconUser: "user", IconUsers: "users", IconUserPlus: "user-plus", IconBuilding: "building-2", IconMail: "mail", IconPhone: "phone", IconBell: "bell", IconSettings: "settings", IconCalendar: "calendar", IconClock: "clock", IconHistory: "history", IconFile: "file-text", IconFolder: "folder", IconImage: "image", IconTag: "tag", IconReceipt: "receipt", IconPackage: "package", IconCard: "credit-card", IconGlobe: "globe", IconCode: "code", IconTerminal: "terminal", IconKey: "key-round", IconZap: "zap", IconMenu: "menu", IconSidebar: "panel-left", IconPanelRight: "panel-right", IconCommand: "command", IconSun: "sun", IconMoon: "moon", IconPlay: "play", IconPause: "pause", IconFlag: "flag", IconDatabase: "database", IconServer: "server", IconWebhook: "webhook",
};

// Added in v2
export const IconZoomIn = keelIcon(ZoomIn, "ZoomIn");
export const IconBold = keelIcon(Bold, "Bold");
export const IconItalic = keelIcon(Italic, "Italic");
export const IconUnderline = keelIcon(Underline, "Underline");
export const IconStrikethrough = keelIcon(Strikethrough, "Strikethrough");
export const IconListOrdered = keelIcon(ListOrdered, "ListOrdered");
export const IconQuote = keelIcon(Quote, "Quote");
export const IconHeading = keelIcon(Heading2, "Heading2");
export const IconSparkles = keelIcon(Sparkles, "Sparkles");
export const IconBot = keelIcon(Bot, "Bot");
export const IconMic = keelIcon(Mic, "Mic");
export const IconPaperclip = keelIcon(Paperclip, "Paperclip");
export const IconSend = keelIcon(SendHorizontal, "SendHorizontal");
export const IconThumbsUp = keelIcon(ThumbsUp, "ThumbsUp");
export const IconThumbsDown = keelIcon(ThumbsDown, "ThumbsDown");
export const IconUndo = keelIcon(Undo2, "Undo2");
export const IconRedo = keelIcon(Redo2, "Redo2");
export const IconStop = keelIcon(Square, "Square");
export const IconWrench = keelIcon(Wrench, "Wrench");
export const IconBrain = keelIcon(Brain, "Brain");
export const IconTimer = keelIcon(Timer, "Timer");
export const IconHash = keelIcon(Hash, "Hash");
export const IconPin = keelIcon(Pin, "Pin");
export const IconBookmark = keelIcon(Bookmark, "Bookmark");
export const IconShare = keelIcon(Share2, "Share2");
export const IconHeart = keelIcon(Heart, "Heart");
export const IconMaximize = keelIcon(Maximize2, "Maximize2");
export const IconMinimize = keelIcon(Minimize2, "Minimize2");
export const IconAtSign = keelIcon(AtSign, "AtSign");
export const IconSmile = keelIcon(Smile, "Smile");
export const IconLayers = keelIcon(Layers, "Layers");
export const IconPalette = keelIcon(Palette, "Palette");
export const IconType = keelIcon(Type, "Type");
export const IconVideo = keelIcon(Video, "Video");
export const IconMusic = keelIcon(Music, "Music");
export const IconRocket = keelIcon(Rocket, "Rocket");
export const IconTarget = keelIcon(Target, "Target");
export const IconTrendingUp = keelIcon(TrendingUp, "TrendingUp");
export const IconTrendingDown = keelIcon(TrendingDown, "TrendingDown");
export const IconWallet = keelIcon(Wallet, "Wallet");
export const IconShoppingCart = keelIcon(ShoppingCart, "ShoppingCart");
export const IconCloud = keelIcon(Cloud, "Cloud");
export const IconCpu = keelIcon(Cpu, "Cpu");
export const IconBug = keelIcon(Bug, "Bug");
export const IconGitBranch = keelIcon(GitBranch, "GitBranch");
export const IconCompass = keelIcon(Compass, "Compass");
export const IconMap = keelIcon(Map, "Map");
export const IconMegaphone = keelIcon(Megaphone, "Megaphone");
export const IconMessageSquare = keelIcon(MessageSquare, "MessageSquare");
export const IconWorkflow = keelIcon(Workflow, "Workflow");
export const IconBook = keelIcon(BookOpen, "BookOpen");
export const IconLightbulb = keelIcon(Lightbulb, "Lightbulb");
export const IconGauge = keelIcon(Gauge, "Gauge");
export const IconCircle = keelIcon(Circle, "Circle");
export const IconCircleDashed = keelIcon(CircleDashed, "CircleDashed");
export const IconCircleDot = keelIcon(CircleDot, "CircleDot");
export const IconClipboard = keelIcon(ClipboardList, "ClipboardList");
export const IconFingerprint = keelIcon(Fingerprint, "Fingerprint");
export const IconScale = keelIcon(Scale, "Scale");
export const IconSigma = keelIcon(Sigma, "Sigma");
export const IconTable = keelIcon(Table2, "Table2");
export const IconKanban = keelIcon(SquareKanban, "SquareKanban");
export const IconSplit = keelIcon(Columns2, "Columns2");
export const IconExpand = keelIcon(ChevronsUpDown, "ChevronsUpDown");
export const IconFilePlus = keelIcon(FilePlus2, "FilePlus2");
export const IconFileCode = keelIcon(FileCode2, "FileCode2");
export const IconFileImage = keelIcon(FileImage, "FileImage");
export const IconSliders2 = keelIcon(Settings2, "Settings2");
export const IconRadio = keelIcon(Radio, "Radio");
export const IconStore = keelIcon(Store, "Store");
export const IconTruck = keelIcon(Truck, "Truck");
export const IconAward = keelIcon(Award, "Award");
export const IconPercent = keelIcon(Percent, "Percent");
export const IconDollarSign = keelIcon(DollarSign, "DollarSign");
export const IconLanguages = keelIcon(Languages, "Languages");
export const IconAccessibility = keelIcon(Accessibility, "Accessibility");
export const IconKeyboard = keelIcon(Keyboard, "Keyboard");
export const IconMousePointer = keelIcon(MousePointer2, "MousePointer2");
export const IconFeather = keelIcon(Feather, "Feather");
export const IconCoffee = keelIcon(Coffee, "Coffee");
export const IconLeaf = keelIcon(Leaf, "Leaf");
export const IconFlame = keelIcon(Flame, "Flame");
export const IconShapes = keelIcon(Shapes, "Shapes");

/** Every Keel icon by name (v1 + v2). */
export const allIcons = { ...icons, IconZoomIn, IconBold, IconItalic, IconUnderline, IconStrikethrough, IconListOrdered, IconQuote, IconHeading, IconSparkles, IconBot, IconMic, IconPaperclip, IconSend, IconThumbsUp, IconThumbsDown, IconUndo, IconRedo, IconStop, IconWrench, IconBrain, IconTimer, IconHash, IconPin, IconBookmark, IconShare, IconHeart, IconMaximize, IconMinimize, IconAtSign, IconSmile, IconLayers, IconPalette, IconType, IconVideo, IconMusic, IconRocket, IconTarget, IconTrendingUp, IconTrendingDown, IconWallet, IconShoppingCart, IconCloud, IconCpu, IconBug, IconGitBranch, IconCompass, IconMap, IconMegaphone, IconMessageSquare, IconWorkflow, IconBook, IconLightbulb, IconGauge, IconCircle, IconCircleDashed, IconCircleDot, IconClipboard, IconFingerprint, IconScale, IconSigma, IconTable, IconKanban, IconSplit, IconExpand, IconFilePlus, IconFileCode, IconFileImage, IconSliders2, IconRadio, IconStore, IconTruck, IconAward, IconPercent, IconDollarSign, IconLanguages, IconAccessibility, IconKeyboard, IconMousePointer, IconFeather, IconCoffee, IconLeaf, IconFlame, IconShapes } as const;
