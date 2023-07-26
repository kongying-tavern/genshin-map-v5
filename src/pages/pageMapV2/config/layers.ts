import type { TagOptions } from './tags'
import { LAYER_TAG_CONFIGS } from './tags'
import type { OverlayOptions } from './overlays'
import { LAYER_OVERLAY_CONFIG } from './overlays'

/** 底图配置 */
export interface LayerConfig {
  /**
   * 底图代码
   * @required
   */
  code: string
  /**
   * 底图名称
   * @required
   */
  name: string
  /**
   * 附加在请求路径最后的底图切片类型后缀名
   * @default 'png'
   */
  extension?: string
  /**
   * 图层尺寸
   * @valid 必须为 256 的整数倍。
   * @required
   */
  size: [w: number, h: number]
  /**
   * tiles 偏移量，用于调整 tiles 在图层范围内的位置。
   * @valid 必须为 256 的整数倍。
   * @default [0,0]
   */
  tilesOffset?: [x: number, y: number]
  /**
   * 中心点坐标，会影响获取到的地图坐标
   * @default [0,0]
   */
  center?: [x: number, y: number]
  /**
   * 当前地图包含的 areaCode
   * @default []
   */
  areaCodes?: string[]
  /**
   * 标注
   * @default []
   */
  tags?: TagOptions[]
  /**
   * 附加图层
   * @default []
   */
  overlays?: OverlayOptions[]
  /**
   * 初始化视图状态
   * @default
   * { zoom:0, minZoom:-4, maxZoom:0 }
   */
  initViewState?: {
    target?: [number, number]
    zoom?: number
    minZoom?: number
    maxZoom?: number
  }
}

export const LAYER_CONFIGS: LayerConfig[] = [
  {
    code: 'twt40',
    name: '提瓦特',
    size: [17408, 17408],
    tilesOffset: [5888, 2048],
    center: [3568, 6286],
    areaCodes: [
      'A:MD:MENGDE',
      'A:MD:XUESHAN',
      'A:LY:LIYUE',
      'A:LY:CENGYAN',
      'A:DQ:1',
      'A:DQ:2',
      'A:DQ:HEGUAN',
      'A:XM:FOREST',
      'A:XM:DESERT',
      'A:XM:DESERT2',
      'A:XM:DESERT3',
      'A:FD:FENGDAN',
    ],
    tags: LAYER_TAG_CONFIGS.twt40,
    overlays: LAYER_OVERLAY_CONFIG.twt40,
    initViewState: {
      target: [-3184, -169],
      zoom: 0,
      maxZoom: 2,
    },
  },
  {
    code: 'qd',
    name: '金苹果群岛V1.6_阶段一',
    extension: 'jpg',
    size: [8192, 8192],
    center: [3568, 6286],
    areaCodes: ['A:APPLE:1_6_STG1'],
    tags: LAYER_TAG_CONFIGS.qd,
    initViewState: {
      zoom: -3,
      minZoom: -3,
    },
  },
  {
    code: 'qd1',
    name: '金苹果群岛V1.6_阶段二',
    extension: 'jpg',
    size: [8192, 8192],
    center: [3568, 6286],
    areaCodes: ['A:APPLE:1_6_STG2'],
    tags: LAYER_TAG_CONFIGS.qd1,
    initViewState: {
      zoom: -3,
      minZoom: -3,
    },
  },
  {
    code: 'qd28',
    name: '金苹果群岛V2.8',
    size: [8192, 8192],
    center: [3568, 6286],
    areaCodes: ['A:APPLE:2_8'],
    tags: LAYER_TAG_CONFIGS.qd28,
    initViewState: {
      zoom: -3,
      minZoom: -3,
    },
  },
  {
    code: 'cyjy',
    name: '层岩巨渊',
    size: [12288, 12288],
    center: [3568, 6286],
    areaCodes: ['A:LY:CENGYAN_UG'],
    tags: LAYER_TAG_CONFIGS.cyjy,
    initViewState: {
      zoom: -3,
      minZoom: -3,
    },
  },
  {
    code: 'yxg',
    name: '渊下宫',
    size: [12288, 12288],
    center: [3568, 6286],
    areaCodes: ['A:DQ:YUANXIAGONG'],
    tags: LAYER_TAG_CONFIGS.yxg,
  },
  {
    code: 'yxg2',
    name: '三界路飨祭',
    size: [12288, 12288],
    center: [3568, 6286],
    areaCodes: ['A:DQ:SANJIE'],
    tags: LAYER_TAG_CONFIGS.yxg2,
  },
  {
    code: 'lxsj',
    name: '琉形蜃境',
    size: [12288, 12288],
    center: [3568, 6286],
    areaCodes: ['A:VELURIYAM:3_8'],
    tags: LAYER_TAG_CONFIGS.lxsj,
  },
]
