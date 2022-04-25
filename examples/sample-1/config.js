/*
 * @Author: zhangbo
 * @Date: 2022-04-06 15:43:18
 * @LastEditors: zhangbo
 * @LastEditTime: 2022-04-07 19:32:38
 * @FilePath: \supermap3d-framework\examples\sample-1\config.js
 * @Description:
 *
 * Copyright (c) 2022 by zhangbo/sipsd, All Rights Reserved.
 */
// import { layers } from './layers'

export const config = {
  iServerBaseURL: 'http://106.14.242.98:8090/',
  layers: [
    {
      expand: true,
      children: [
        {
          children: [
            {
              isEditing: false,
              name: '一期二期规划范围',
              id: 'f4eda29396db4dc49079bfc181247d7d',
              type: 'FILE',
              layer: {
                type: 'SMIMG',
                url: 'http://58.210.9.131:8066/iserver55/services/map-THXC/rest/maps/GHFW',
              },
              parentId: 'e5bdad1840df415c83f46afe592817a2',
            },
          ],
          isEditing: false,
          name: '规划范围',
          id: 'e5bdad1840df415c83f46afe592817a2',
          type: 'FOLDER',
        },
        {
          children: [
            {
              isEditing: false,
              name: '2020年',
              id: 'd108fa2293624494aead439628c1932b',
              type: 'FILE',
              layer: {
                type: 'SMIMG',
                url: 'http://58.210.9.131:8066/iserver55/services/map-agscache-Layers/rest/maps/Layers',
              },
              parentId: 'c9ca453820d94f7db47db78b137dfb43',
            },
            {
              isEditing: false,
              name: '2018年',
              id: '6027e1d59ea34db0bd66cf9acef1743e',
              type: 'FILE',
              layer: {
                type: 'SMIMG',
                url: 'http://58.210.9.131:8066/iserver55/services/map-agscache-THXCHPYX2018/rest/maps/THXC_HPYX2018',
              },
              parentId: 'c9ca453820d94f7db47db78b137dfb43',
            },
            {
              isEditing: false,
              name: '2017年',
              id: 'e59c3cedb7ab42a89d94ebb8debde499',
              type: 'FILE',
              layer: {
                type: 'SMIMG',
                url: 'http://58.210.9.131:8066/iserver55/services/map-agscache-THXCHPYX2017/rest/maps/THXC_HPYX2017',
              },
              parentId: 'c9ca453820d94f7db47db78b137dfb43',
            },
            {
              isEditing: false,
              name: '2014年',
              id: 'f863fa9d32864addb48954c963310a92',
              type: 'FILE',
              layer: {
                type: 'SMIMG',
                url: 'http://58.210.9.131:8066/iserver55/services/map-agscache-THXCHPYX2014/rest/maps/THXC_HPYX2014',
              },
              parentId: 'c9ca453820d94f7db47db78b137dfb43',
            },
            {
              isEditing: false,
              name: '2012年',
              id: '93c396b34f604eb7b9b7bc842a3b669e',
              type: 'FILE',
              layer: {
                type: 'SMIMG',
                url: 'http://58.210.9.131:8066/iserver55/services/map-agscache-THXCHPYX2012/rest/maps/THXC_HPYX2012',
              },
              parentId: 'c9ca453820d94f7db47db78b137dfb43',
            },
            {
              isEditing: false,
              name: '2008年',
              id: 'd03e101aab444869bedff5af1c2bba32',
              type: 'FILE',
              layer: {
                type: 'SMIMG',
                url: 'http://58.210.9.131:8066/iserver55/services/map-agscache-THXCHPYX2008/rest/maps/THXC_HPYX2008',
              },
              parentId: 'c9ca453820d94f7db47db78b137dfb43',
            },
            {
              isEditing: false,
              name: '2005年',
              id: '2725ace2009d4c9cbba8712202926033',
              type: 'FILE',
              layer: {
                type: 'SMIMG',
                url: 'http://58.210.9.131:8066/iserver55/services/map-agscachev2-THXCHPYX2005/rest/maps/THXC_HPYX2005',
              },
              parentId: 'c9ca453820d94f7db47db78b137dfb43',
            },
          ],
          isEditing: false,
          name: '航拍影像',
          id: 'c9ca453820d94f7db47db78b137dfb43',
          type: 'FOLDER',
          parentId: '5',
        },
        {
          children: [
            {
              isEditing: false,
              name: '2020年',
              id: '43b110c1687547b5a670b21b629a0997',
              type: 'FILE',
              layer: {
                type: 'SMIMG',
                url: 'http://58.210.9.131:8066/iserver55/services/map-agscache-THXCWXYX2020/rest/maps/THXC_WXYX2020',
              },
              parentId: '3d7192f055d84ba4a2d57eb7455c4c76',
            },
            {
              isEditing: false,
              name: '2019年',
              id: '69a05699e5524e039dcada36605dee24',
              type: 'FILE',
              layer: {
                type: 'SMIMG',
                url: 'http://58.210.9.131:8066/iserver55/services/map-agscache-THXCWXYX2019/rest/maps/THXC_WXYX2019',
              },
              parentId: '3d7192f055d84ba4a2d57eb7455c4c76',
            },
            {
              isEditing: false,
              name: '2018年',
              id: '408d9304cfc44512abec034bd367e1e3',
              type: 'FILE',
              layer: {
                type: 'SMIMG',
                url: 'http://58.210.9.131:8066/iserver55/services/map-agscache-THXCWXYX2018/rest/maps/THXC_WXYX2018',
              },
              parentId: '3d7192f055d84ba4a2d57eb7455c4c76',
            },
            {
              isEditing: false,
              name: '2017年',
              id: '02e22c3fdcd34c49a8b33d2b6a40c53d',
              type: 'FILE',
              layer: {
                type: 'SMIMG',
                url: 'http://58.210.9.131:8066/iserver55/services/map-agscache-THXCWXYX2017/rest/maps/THXC_WXYX2017',
              },
              parentId: '3d7192f055d84ba4a2d57eb7455c4c76',
            },
            {
              isEditing: false,
              name: '2016年',
              id: '3ace205f0d4244e4bbeba2d10aa4204d',
              type: 'FILE',
              layer: {
                type: 'SMIMG',
                url: 'http://58.210.9.131:8066/iserver55/services/map-agscachev2-THXCWXYX2016/rest/maps/THXC_WXYX2016',
              },
              parentId: '3d7192f055d84ba4a2d57eb7455c4c76',
            },
            {
              isEditing: false,
              name: '2015年',
              id: '20e9886162b141ffae81eb2718fc5944',
              type: 'FILE',
              layer: {
                type: 'SMIMG',
                url: 'http://58.210.9.131:8066/iserver55/services/map-agscachev2-THXCWXYX2015/rest/maps/THXC_WXYX2015',
              },
              parentId: '3d7192f055d84ba4a2d57eb7455c4c76',
            },
            {
              isEditing: false,
              name: '2014年',
              id: 'ed1f8f47776b48618333fde51b45b8f5',
              type: 'FILE',
              layer: {
                type: 'SMIMG',
                url: 'http://58.210.9.131:8066/iserver55/services/map-agscachev2-THXCWXYX2014/rest/maps/THXC_WXYX2014',
              },
              parentId: '3d7192f055d84ba4a2d57eb7455c4c76',
            },
            {
              isEditing: false,
              name: '2013年',
              id: '5ed27a0bd5ac4376b5f5e33b71cc4c99',
              type: 'FILE',
              layer: {
                type: 'SMIMG',
                url: 'http://58.210.9.131:8066/iserver55/services/map-agscachev2-THXCWXYX2013/rest/maps/THXC_WXYX2013',
              },
              parentId: '3d7192f055d84ba4a2d57eb7455c4c76',
            },
            {
              isEditing: false,
              name: '2012年',
              id: '0eea72c83e7f47a090add1898ecfd57f',
              type: 'FILE',
              layer: {
                type: 'SMIMG',
                url: 'http://58.210.9.131:8066/iserver55/services/map-agscachev2-THXCWXYX2012/rest/maps/THXC_WXYX2012',
              },
              parentId: '3d7192f055d84ba4a2d57eb7455c4c76',
            },
            {
              isEditing: false,
              name: '2011年',
              id: '3a312376b4724abd9d7dcc39903fda6e',
              type: 'FILE',
              layer: {
                type: 'SMIMG',
                url: 'http://58.210.9.131:8066/iserver55/services/map-agscachev2-THXCWXYX2011/rest/maps/THXC_WXYX2011',
              },
              parentId: '3d7192f055d84ba4a2d57eb7455c4c76',
            },
            {
              isEditing: false,
              name: '2010年',
              id: '508ae8f82ef4499888bd8e1b60ce0418',
              type: 'FILE',
              layer: {
                type: 'SMIMG',
                url: 'http://58.210.9.131:8066/iserver55/services/map-agscachev2-THXCWXYX2010/rest/maps/THXC_WXYX2010',
              },
              parentId: '3d7192f055d84ba4a2d57eb7455c4c76',
            },
          ],
          isEditing: false,
          name: '卫星影像',
          id: '3d7192f055d84ba4a2d57eb7455c4c76',
          type: 'FOLDER',
          parentId: '5',
        },
        {
          children: [
            {
              isEditing: false,
              name: '越溪横泾2030远期总规',
              id: '9bbe74c9c66f4ad494cfe3d8cd338be7',
              type: 'FILE',
              layer: {
                legend: 'legend/ZG.png',
                type: 'SMIMG',
                fastQuery: 'KC1646306379146',
                url: 'http://58.210.9.131:8066/iserver55/services/map-agscachev2-THXCZGYQGH2030/rest/maps/THXC_ZG_YQGH2030',
              },
              parentId: '5',
            },
            {
              isEditing: false,
              name: '越溪横泾近期规划总规',
              id: 'd3c02dca416145c4936794b2c4000962',
              type: 'FILE',
              layer: {
                legend: 'legend/ZG.png',
                type: 'SMIMG',
                fastQuery: 'KC1646306606716',
                url: 'http://58.210.9.131:8066/iserver55//services/map-agscachev2-THXCZGJQGH2020/rest/maps/THXC_ZG_JQGH2020',
              },
              parentId: '5',
            },
          ],
          isEditing: false,
          name: '总体规划',
          id: 'b6b54e515b334839bc4633f03b8873b6',
          type: 'FOLDER',
          parentId: '5',
        },
        {
          expand: false,
          children: [
            {
              isEditing: false,
              name: '控规',
              id: 'e8558e14ceb64b43ab42970e53ed169a',
              type: 'FILE',
              cesiumLayerLoaded: false,
              layer: {
                legend: 'legend/KG.png',
                type: 'SMIMG',
                fastQuery: 'KC1646306720424',
                url: 'http://58.210.9.131:8066/iserver55/services/map-agscachev2-THXCKGTHXC/rest/maps/THXC_KG_THXC',
              },
              parentId: '5',
            },
          ],
          id: '5000',
          label: '控制性详细规划',
        },
        {
          expand: false,
          children: [
            {
              name: '村镇建设控制区2021',
              id: '3300',
              type: 'FILE',
              layer: {
                type: 'SMIMG',
                fastQuery: 'KC1646306720424',
                url: 'http://58.210.9.131:8066/iserver55/services/map-agscachev2-THXCCZJSKZQ2021/rest/maps/THXC_CZJSKZQ2021',
              },
            },
            {
              isEditing: false,
              name: '点状重点建设项目2021',
              id: '4958a470eac94cfab18595a85255f946',
              type: 'FILE',
              layer: {
                type: 'SMIMG',
                fastQuery: 'KC1646307149625',
                url: 'http://58.210.9.131:8066/iserver55/services/map-agscachev2-THXCDZZDJSXM2021/rest/maps/THXC_DZZDJSXM2021',
              },
              parentId: '3000',
            },
            {
              isEditing: false,
              name: '面状重点建设项目2021',
              id: '8a227683a59d49dda5979bcae94d12ff',
              type: 'FILE',
              layer: {
                type: 'SMIMG',
                fastQuery: 'KC1646307334796',
                url: 'http://58.210.9.131:8066/iserver55/services/map-agscachev2-THXCMZZDJSXM2021/rest/maps/THXC_MZZDJSXM2021',
              },
              parentId: '3000',
            },
            {
              isEditing: false,
              name: '线状重点建设项目2021',
              id: '2ecdb8e1be474bea839575708fafe0cd',
              type: 'FILE',
              layer: {
                type: 'SMIMG',
                fastQuery: 'KC1646307445720',
                url: 'http://58.210.9.131:8066/iserver55/services/map-agscachev2-THXCXZZDJSXM2021/rest/maps/THXC_XZZDJSXM2021',
              },
              parentId: '3000',
            },
            {
              name: '建设用地管制区2021',
              id: '3200',
              type: 'FILE',
              layer: {
                legend: 'legend/JSYDGZQ.png',
                type: 'SMIMG',
                fastQuery: 'KC1646307579202',
                url: 'http://58.210.9.131:8066/iserver55/services/map-agscachev2-THXCJSYDGZQ2021/rest/maps/THXC_JSYDGZQ2021',
              },
            },
            {
              isEditing: false,
              name: '土地用途区2021',
              id: 'f6fd5511306942ac94f17ae21c805e6a',
              type: 'FILE',
              layer: {
                legend: 'legend/TDYTQ.png',
                type: 'SMIMG',
                fastQuery: 'KC1646307701934',
                url: 'http://58.210.9.131:8066/iserver55/services/map-agscachev2-THXCTDYTQ2021/rest/maps/THXC_TDYTQ2021',
              },
              parentId: '3000',
            },
            {
              isEditing: false,
              name: '规划基本农田调整',
              id: '9a6726de7ee94144a3ea3e411ebd5c1b',
              type: 'FILE',
              layer: {
                type: 'SMIMG',
                fastQuery: 'KC1646306720424',
                url: 'http://58.210.9.131:8066/iserver55/services/map-THXC/rest/maps/GHJBNTTZ',
              },
              parentId: '3000',
            },
          ],
          id: '3000',
          label: '近期实施方案',
        },
        {
          children: [
            {
              isEditing: false,
              name: '土地利用现状_三调',
              id: 'ef631476f4ce49638927740150c732e8',
              type: 'FILE',
              layer: {
                legend: 'legend/SDDLTB.png',
                type: 'SMIMG',
                fastQuery: 'KC1646305471513',
                url: 'http://58.210.9.131:8066/iserver55/services/map-agscachev2-THXCTDLYXZSDZFB/rest/maps/THXC_TDLYXZSDZFB',
              },
              parentId: 'ba594fd206aa45d7bf1deac66bddba08',
            },
            {
              isEditing: false,
              name: '土地利用现状_2020年',
              id: '1e0191122e80459198dd7105f7e06d67',
              type: 'FILE',
              layer: {
                legend: 'legend/SDDLTB.png',
                type: 'SMIMG',
                fastQuery: 'KC1646306013921',
                url: 'http://58.210.9.131:8066/iserver55/services/map-agscachev2-THXCTDLYXZ2020/rest/maps/THXC_TDLYXZ2020',
              },
              parentId: 'ba594fd206aa45d7bf1deac66bddba08',
            },
            {
              name: '土地利用现状_2018年',
              id: '2000',
              type: 'FILE',
              layer: {
                legend: 'legend/EDDLTB.png',
                type: 'SMIMG',
                fastQuery: 'KC1646306139130',
                url: 'http://58.210.9.131:8066/iserver55/services/map-agscachev2-THXCTDLYXZ2018/rest/maps/THXC_TDLYXZ_2018',
              },
            },
          ],
          isEditing: false,
          name: '土地利用现状',
          id: 'ba594fd206aa45d7bf1deac66bddba08',
          type: 'FOLDER',
          parentId: '5',
        },
        {
          children: [
            {
              children: [
                {
                  name: '林地现状2020年',
                  id: '6100',
                  type: 'FILE',
                  layer: {
                    type: 'SMIMG',
                    url: 'http://58.210.9.131:8066/iserver55/services/map-THXC/rest/maps/LD_XZ2020',
                  },
                },
                {
                  isEditing: false,
                  name: '林业现状2019年',
                  id: '2f009f9e068341298cfd05434c5df202',
                  type: 'FILE',
                  layer: {
                    type: 'SMIMG',
                    url: 'http://58.210.9.131:8066/iserver55/services/map-THXC/rest/maps/LD_XZ2019',
                  },
                  parentId: 'b838deaeecb94b9eab93887aaaa21d6e',
                },
                {
                  isEditing: false,
                  name: '林地现状监察图斑2019年',
                  id: '9a5e548a38f34c3f91625e7057be78ea',
                  type: 'FILE',
                  layer: {
                    type: 'SMIMG',
                    url: 'http://58.210.9.131:8066/iserver55/services/map-THXC/rest/maps/LD_DC2019',
                  },
                  parentId: 'b838deaeecb94b9eab93887aaaa21d6e',
                },
                {
                  isEditing: false,
                  name: '林业现状2017年',
                  id: '3c911589ce1b4201826bd88b0210f269',
                  type: 'FILE',
                  layer: {
                    type: 'SMIMG',
                    url: 'http://58.210.9.131:8066/iserver55/services/map-THXC/rest/maps/LD_XZ2017',
                  },
                  parentId: 'b838deaeecb94b9eab93887aaaa21d6e',
                },
              ],
              isEditing: false,
              name: '林地现状',
              id: 'b838deaeecb94b9eab93887aaaa21d6e',
              type: 'FOLDER',
              parentId: '34adc51e1fcf4f66af157b0406e3a221',
            },
            {
              expand: false,
              children: [
                {
                  name: '省级重要湿地20200307',
                  id: '6201',
                  type: 'FILE',
                  layer: {
                    type: 'SMIMG',
                    url: 'http://58.210.9.131:8066/iserver55/services/map-THXC/rest/maps/LD_SJSD202003',
                  },
                },
                {
                  name: '市级重要湿地20200509',
                  id: '6202',
                  type: 'FILE',
                  layer: {
                    type: 'SMIMG',
                    url: 'http://58.210.9.131:8066/iserver55/services/map-THXC/rest/maps/LD_SZSJSD202005',
                  },
                },
                {
                  name: '湿地保护小区20201030',
                  id: '6204',
                  type: 'FILE',
                  layer: {
                    type: 'SMIMG',
                    url: 'http://58.210.9.131:8066/iserver55/services/map-THXC/rest/maps/LD_SDBHXQ202010',
                  },
                },
                {
                  name: '一般湿地',
                  id: '6203',
                  type: 'FILE',
                  layer: {
                    type: 'SMIMG',
                    url: 'http://58.210.9.131:8066/iserver55/services/map-THXC/rest/maps/LD_YBSD',
                  },
                },
              ],
              id: '6200',
              label: '林业湿地',
            },
          ],
          isEditing: false,
          name: '林地湿地',
          id: '34adc51e1fcf4f66af157b0406e3a221',
          type: 'FOLDER',
        },
        {
          expand: false,
          children: [
            {
              expand: false,
              children: [
                {
                  name: '2021年',
                  id: '4102',
                  type: 'FILE',
                  layer: {
                    type: 'SMIMG',
                    url: 'http://58.210.9.131:8066/iserver55/services/map-THXC/rest/maps/STGKQ2021',
                  },
                },
              ],
              id: '4100',
              label: '省生态管控区',
            },
            {
              children: [
                {
                  name: '开发边界',
                  id: '4400',
                  type: 'FILE',
                  layer: {
                    type: 'SMIMG',
                    url: 'http://58.210.9.131:8066/iserver55/services/map-THXC/rest/maps/KFBJ',
                  },
                },
              ],
              isEditing: false,
              name: '开发边界',
              id: '31a67bd1e9c642d9bb176fe0cbe8ebed',
              type: 'FOLDER',
              parentId: '4000',
            },
            {
              expand: false,
              children: [
                {
                  name: '6.67万亩工业保障线成果',
                  id: '4301',
                  type: 'FILE',
                  layer: {
                    type: 'SMIMG',
                    url: 'http://58.210.9.131:8066/iserver55/services/map-THXC/rest/maps/GYBZX',
                  },
                },
                {
                  name: '10万亩工业保障线成果',
                  id: '4302',
                  type: 'FILE',
                  layer: {
                    type: 'SMIMG',
                    url: 'http://58.210.9.131:8066/iserver55/services/map-THXC/rest/maps/GYBZX10',
                  },
                },
              ],
              id: '4300',
              label: '工业保障线',
            },
          ],
          name: '三线划定',
          id: '4000',
          label: '三线划定',
        },
        {
          children: [
            {
              isEditing: false,
              name: '项目红线',
              id: '423dfa814fb8437bbdb2c9d07531eadf',
              type: 'FILE',
              layer: {
                legend: 'legend/YDHX.png',
                type: 'SMIMG',
                fastQuery: 'KC1646357769589',
                url: 'http://58.210.9.131:8066/iserver55/services/map-THXC/rest/maps/XMHX_YD',
              },
              parentId: '0ac859908e7243c49a90545a40e36b35',
            },
            {
              isEditing: false,
              name: '道路红线',
              id: '4aeb7cc05b314b92bd2f67349e42972d',
              type: 'FILE',
              layer: {
                type: 'SMIMG',
                fastQuery: 'KC1646360973048',
                url: 'http://58.210.9.131:8066/iserver55/services/map-THXC/rest/maps/XMHX_DL',
              },
              parentId: '0ac859908e7243c49a90545a40e36b35',
            },
          ],
          isEditing: false,
          name: '规划管理',
          id: '0ac859908e7243c49a90545a40e36b35',
          type: 'FOLDER',
          parentId: '5',
        },
        {
          expand: false,
          children: [
            {
              name: '项目预审',
              id: '7800',
              type: 'FILE',
              layer: {
                type: 'SMIMG',
                fastQuery: 'KC1646361221262',
                url: 'http://58.210.9.131:8066/iserver55/services/map-THXC/rest/maps/YSDK',
              },
            },
            {
              name: '征地批次',
              id: '7100',
              type: 'FILE',
              layer: {
                type: 'SMIMG',
                fastQuery: 'KC1646361593237',
                url: 'http://58.210.9.131:8066/iserver55/services/map-THXC/rest/maps/JSYDBP',
              },
            },
            {
              name: '供地地块',
              id: '7200',
              type: 'FILE',
              layer: {
                type: 'SMIMG',
                fastQuery: 'KC1646370448535',
                url: 'http://58.210.9.131:8066/iserver55/services/map-THXC/rest/maps/TDGY',
              },
            },
            {
              name: '土地收回',
              id: '7300',
              type: 'FILE',
              layer: {
                type: 'SMIMG',
                fastQuery: 'KC1646370992266',
                url: 'http://58.210.9.131:8066/iserver55/services/map-THXC/rest/maps/TDSH',
              },
            },
            {
              name: '土地储备',
              id: '7700',
              type: 'FILE',
              layer: {
                type: 'SMIMG',
                fastQuery: 'KC1646371253806',
                url: 'http://58.210.9.131:8066/iserver55/services/map-THXC/rest/maps/TDCB',
              },
            },
          ],
          id: '7000',
          label: '土地管理',
        },
        {
          expand: false,
          children: [
            {
              children: [
                {
                  isEditing: false,
                  name: '供电管线',
                  id: '12bccbd1c3c640f786a8b32f51a40f4a',
                  type: 'FILE',
                  layer: {
                    type: 'SMIMG',
                    url: 'http://58.210.9.131:8066/iserver55/services/map-THXC/rest/maps/GX_GD',
                  },
                  parentId: 'eaa52f2e89b448f2b9aec3a64b4077c7',
                },
                {
                  isEditing: false,
                  name: '给水管线',
                  id: '32b91dc5ad07406abdea675359abd8c9',
                  type: 'FILE',
                  layer: {
                    type: 'SMIMG',
                    url: 'http://58.210.9.131:8066/iserver55/services/map-THXC/rest/maps/GX_JS',
                  },
                  parentId: 'eaa52f2e89b448f2b9aec3a64b4077c7',
                },
                {
                  isEditing: false,
                  name: '燃气管线',
                  id: '45e5642f6d7b40eaae9c2073c91bdc0d',
                  type: 'FILE',
                  layer: {
                    type: 'SMIMG',
                    url: 'http://58.210.9.131:8066/iserver55/services/map-THXC/rest/maps/GX_TR',
                  },
                  parentId: 'eaa52f2e89b448f2b9aec3a64b4077c7',
                },
                {
                  isEditing: false,
                  name: '污水管线',
                  id: '79faad361ae141658575f53bdc141dfc',
                  type: 'FILE',
                  layer: {
                    type: 'SMIMG',
                    url: 'http://58.210.9.131:8066/iserver55/services/map-THXC/rest/maps/GX_WS',
                  },
                  parentId: 'eaa52f2e89b448f2b9aec3a64b4077c7',
                },
                {
                  isEditing: false,
                  name: '雨水管线',
                  id: '6d7f8533d77e4f5b9444e3ea48cd9b59',
                  type: 'FILE',
                  layer: {
                    type: 'SMIMG',
                    url: 'http://58.210.9.131:8066/iserver55/services/map-THXC/rest/maps/GX_YS',
                  },
                  parentId: 'eaa52f2e89b448f2b9aec3a64b4077c7',
                },
              ],
              isEditing: false,
              name: '现状管线',
              id: 'eaa52f2e89b448f2b9aec3a64b4077c7',
              type: 'FOLDER',
              parentId: '8000',
            },
          ],
          name: '管线数据',
          id: '8000',
          label: '管线',
          type: 'FOLDER',
        },
        {
          children: [
            {
              isEditing: false,
              name: '工矿数据',
              id: '230a43c11ee44f4381b9fb0e00d7bd39',
              type: 'FILE',
              layer: {
                type: 'SMIMG',
                fastQuery: 'KC1646371756547',
                url: 'http://58.210.9.131:8066/iserver55/services/map-THXC/rest/maps/TDZZ_GK',
              },
              parentId: '7cc9e91b5cc04208b35a754dbf2a8cde',
            },
            {
              isEditing: false,
              name: '占补平衡',
              id: '96de8b6134c143349dd1c3dccd72525b',
              type: 'FILE',
              layer: {
                type: 'SMIMG',
                fastQuery: 'KC1646372096478',
                url: 'http://58.210.9.131:8066/iserver55/services/map-THXC/rest/maps/TDZZ_ZB',
              },
              parentId: '7cc9e91b5cc04208b35a754dbf2a8cde',
            },
          ],
          isEditing: false,
          name: '土地整治',
          id: '7cc9e91b5cc04208b35a754dbf2a8cde',
          type: 'FOLDER',
          parentId: '5',
        },
        {
          children: [
            {
              isEditing: false,
              name: '宗地',
              id: 'b25972f4355c479dabe61aefbf8c1829',
              type: 'FILE',
              layer: {
                type: 'SMIMG',
                fastQuery: 'KC1646371425177',
                url: 'http://58.210.9.131:8066/iserver55/services/map-THXC/rest/maps/ZDHJH',
              },
              parentId: '25919a84b1384933842a65f10a32565f',
            },
            {
              isEditing: false,
              name: '不动产整合',
              id: '946c1dfd612f4f7d88781a2f7a73f4f3',
              type: 'FILE',
              layer: {
                type: 'SMIMG',
                fastQuery: 'KC1646371561718',
                url: 'http://58.210.9.131:8066/iserver55/services/map-THXC/rest/maps/BDCZH',
              },
              parentId: '25919a84b1384933842a65f10a32565f',
            },
          ],
          isEditing: false,
          name: '确权登记（历史）',
          id: '25919a84b1384933842a65f10a32565f',
          type: 'FOLDER',
          parentId: '5',
        },
      ],
      name: '二维图层',
      id: '5',
      label: '二维图层',
    },
    {
      expand: true,
      children: [
        {
          children: [
            {
              isEditing: false,
              name: '道路',
              id: '8f9f00be88394b67afc3b46f0e1101e0',
              type: 'FILE',
              layer: {
                type: 'S3M',
                url: 'http://58.210.9.131:8066/iserver55/services/3D-local3DCache-DL1YIQI/rest/realspace/datas/DL_1@YIQI/config',
              },
              parentId: '661b1d838720496e9fab3505cdfc1aad',
            },
            {
              isEditing: false,
              name: '地面',
              id: '1fbc07f954a24cd18c8747c193db3d52',
              type: 'FILE',
              layer: {
                type: 'S3M',
                url: 'http://58.210.9.131:8066/iserver55/services/3D-local3DCache-DM1YIQI/rest/realspace/datas/DM_1@YIQI/config',
              },
              parentId: '661b1d838720496e9fab3505cdfc1aad',
            },
            {
              isEditing: false,
              name: '现状建筑',
              id: 'b4b9a08dbb5d4528a5182a1fe1f57208',
              type: 'FILE',
              layer: {
                type: 'S3M',
                url: 'http://58.210.9.131:8066/iserver55/services/3D-local3DCache-JZHBXZ1YIQI/rest/realspace/datas/JZHB_XZ_1@YIQI/config',
              },
              parentId: '661b1d838720496e9fab3505cdfc1aad',
            },
            {
              isEditing: false,
              name: '规划建筑（在建）',
              id: 'e039dbcb2fec457690a4a9ba4148eb21',
              type: 'FILE',
              layer: {
                type: 'S3M',
                url: 'http://58.210.9.131:8066/iserver55/services/3D-local3DCache-JZHBGHZJ1YIQI/rest/realspace/datas/JZHB_GHZJ_1@YIQI/config',
              },
              parentId: '661b1d838720496e9fab3505cdfc1aad',
            },
            {
              isEditing: false,
              name: '规划建筑（未建）',
              id: '839dab46710743edb4ded5607b951f4d',
              type: 'FILE',
              layer: {
                type: 'S3M',
                url: 'http://58.210.9.131:8066/iserver55/services/3D-local3DCache-JZHBGHWJ1YIQI/rest/realspace/datas/JZHB_GHWJ_1@YIQI/config',
              },
              parentId: '661b1d838720496e9fab3505cdfc1aad',
            },
          ],
          isEditing: false,
          name: '一期',
          id: '661b1d838720496e9fab3505cdfc1aad',
          type: 'FOLDER',
          parentId: '6',
        },
        {
          children: [
            {
              isEditing: false,
              name: '地下一层',
              id: 'c7029621ed0240859d612f75ca2888cc',
              type: 'FILE',
              layer: {
                type: 'S3M',
                url: 'http://58.210.9.131:8066/iserver55/services/3D-local3DCache-B1F44903/rest/realspace/datas/B1F_4490/config',
              },
              parentId: 'adba662f60b147de8dc2eec31bac5649',
            },
            {
              isEditing: false,
              name: '地下二层',
              id: 'f6161e62572b404e986ae55e6853c233',
              type: 'FILE',
              layer: {
                type: 'S3M',
                url: 'http://58.210.9.131:8066/iserver55/services/3D-local3DCache-B2F4490/rest/realspace/datas/B2F_4490/config',
              },
              parentId: 'adba662f60b147de8dc2eec31bac5649',
            },
            {
              isEditing: false,
              name: '地下三层',
              id: '72f3f8fdb09d413d9977cb30492d7ca4',
              type: 'FILE',
              layer: {
                type: 'S3M',
                url: 'http://58.210.9.131:8066/iserver55/services/3D-local3DCache-B3F4490/rest/realspace/datas/B3F_4490/config',
              },
              parentId: 'adba662f60b147de8dc2eec31bac5649',
            },
          ],
          isEditing: false,
          name: '地下空间',
          id: 'adba662f60b147de8dc2eec31bac5649',
          type: 'FOLDER',
          parentId: '6',
        },
        {
          children: [
            {
              isEditing: false,
              name: '给水管线',
              id: '4e75dd4f931e4072bd6f07b661ee40f9',
              type: 'FILE',
              layer: {
                type: 'S3M',
                url: 'http://58.210.9.131:8066/iserver55/services/3D-local3DCache-JSTHXCGX/rest/realspace/datas/JS@THXC%E2%80%94%E2%80%94GX/config',
              },
              parentId: '037dc43e0b5f468fa966f9812f9b24b6',
            },
            {
              isEditing: false,
              name: '污水管线',
              id: '6e6fe684355c420ea0e01729f923e7fa',
              type: 'FILE',
              layer: {
                type: 'S3M',
                url: 'http://58.210.9.131:8066/iserver55/services/3D-local3DCache-WSTHXCGX/rest/realspace/datas/WS@THXC%E2%80%94%E2%80%94GX/config',
              },
              parentId: '037dc43e0b5f468fa966f9812f9b24b6',
            },
            {
              isEditing: false,
              name: '供电管线',
              id: '4a33d54432cc4469b0e1be6170e47202',
              type: 'FILE',
              layer: {
                type: 'S3M',
                url: 'http://58.210.9.131:8066/iserver55/services/3D-local3DCache-GDTHXCGX/rest/realspace/datas/GD@THXC%E2%80%94%E2%80%94GX/config',
              },
              parentId: '037dc43e0b5f468fa966f9812f9b24b6',
            },
          ],
          isEditing: false,
          name: '地下管线',
          id: '037dc43e0b5f468fa966f9812f9b24b6',
          type: 'FOLDER',
          parentId: '6',
        },
      ],
      id: '6',
      label: '三维图层',
    },
  ],
  baseMaps: {
    normal: {
      default: false,
      maps: [
        // {
        //   type: "arcgis",
        //   params: {
        //     url: "http://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer",
        //   },
        // },
      ],
      enable: false,
    },
    earth: {
      default: true,
      maps: [
        {
          type: 'supermap',
          params: {
            url: 'http://58.210.9.131:8066/iserver55/services/map-agscache-Layers/rest/maps/Layers',
          },
        },
      ],
    },
    none: {
      default: false,
      enable: true,
    },
  },
  defaultCamera: {
    duration: 1.5,
    orientation: {
      heading: 0.03628253074130061,
      roll: 0,
      pitch: -1.5578732606687846,
    },
    destination: {
      x: -2778674.259070236,
      y: 4702800.768939265,
      z: 3306480.638035149,
    },
  },
  colorCorrection: {
    saturation: 1.1,
    brightness: 1.5,
    contrast: 1.05,
    hue: 0.05,
  },
};
