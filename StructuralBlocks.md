# AFSIM WSF Structural Blocks Reference

> **Last Updated**: 2026-04-03
> **Data Source**: `wsf.ag` (6077 lines), cross-referenced line by line
> **Purpose**: Parser/LSP 开发的权威参考，记录所有块结构、继承关系、脚本嵌入点

---

## 1. Root-Level Blocks (顶层块)

Root struct (line 1059) 直接定义的块关键字对。这些块出现在文件最外层。

### 1.1 Entity Definition Blocks (实体定义块)

| 开始关键字 | 结束关键字 | 语法格式 | wsf.ag 行号 |
|:---|:---|:---|:---|
| `platform_type` | `end_platform_type` | `platform_type <name> <base_type> ... end_platform_type` | 1086 |
| `platform` | `end_platform` | `platform <name> <type> ... end_platform` | 1095 |
| `edit platform` | `end_platform` | `edit platform <name> ... end_platform` | 1102 |

### 1.2 Component Type Definition Blocks (组件类型定义块)

在 root 作用域用 `<name> <base_type>` 的二参数形式定义类型模板。

| 开始关键字 | 结束关键字 | 默认 base_type | wsf.ag 行号 |
|:---|:---|:---|:---|
| `sensor` | `end_sensor` | `WSF_NULL_SENSOR` | 1167 |
| `processor` | `end_processor` | `WSF_SCRIPT_PROCESSOR` | 1110 |
| `comm` | `end_comm` | `WSF_COMM_TRANSCEIVER` | 1123 |
| `mover` | `end_mover` | `WSF_AIR_MOVER` | 1162 |
| `fuel` | `end_fuel` | `WSF_VARIABLE_RATE_FUEL` | 1116 |
| `network` | `end_network` | `WSF_COMM_NETWORK_MESH` | 1128 |
| `router` | `end_router` | `WSF_COMM_ROUTER` | 1133 |
| `medium` | `end_medium` | `WSF_COMM_MEDIUM_LEGACY` | 1138 |
| `protocol` | `end_protocol` | `WSF_COMM_PROTOCOL_IGMP` | 1146 |
| `router_protocol` | `end_router_protocol` | `WSF_COMM_ROUTER_PROTOCOL_LEGACY` | 1154 |
| `aero` | `end_aero` | `WSF_AERO` | 1217 |
| `visual_part` | `end_visual_part` | `WSF_VISUAL_PART` | 5899 |

### 1.3 Signature & Pattern Blocks (签名与模式块)

| 开始关键字 | 结束关键字 | wsf.ag 行号 |
|:---|:---|:---|
| `radar_signature` | `end_radar_signature` | 1193-1198 |
| `masking_pattern` | `end_masking_pattern` | 1199-1201 |
| `intersect_mesh` | `end_intersect_mesh` | 1202-1204 |
| `thermal_system` | `end_thermal_system` | 1205-1207 |
| `antenna_pattern` | `end_antenna_pattern` | 1208-1213 |

### 1.4 Environment & Scenario Blocks (环境与场景块)

| 开始关键字 | 结束关键字 | wsf.ag 行号 | 备注 |
|:---|:---|:---|:---|
| `terrain` | `end_terrain` | 5682 | `<$terrain>` inline push (line 1222) |
| `global_environment` | `end_global_environment` | 5870 | |
| `central_body` | `end_central_body` | 5821 | 嵌套在 global_environment 或 root 中 |
| `noise_cloud` | `end_noise_cloud` | 5890 | 格式: `noise_cloud <name> <type> ... end_noise_cloud` |
| `gravity_model` | `end_gravity_model` | 5909 | |
| `land_use` | `end_land_use` | 5787 | |

> **注意**: `scenario` 不是块关键字。Scenario 是一个 struct (line 5362)，通过 `<$scenario>` (line 1192) 以 inline variable push 方式引用。Scenario 的命令直接出现在 root 作用域中，不被 `scenario...end_scenario` 包裹。

### 1.5 Infrastructure Blocks (基础设施块)

| 开始关键字 | 结束关键字 | wsf.ag 行号 |
|:---|:---|:---|
| `route` | `end_route` | 1191 |
| `route_network` | `end_route_network` | 1214-1216 |
| `zone` | `end_zone` | 1181 |
| `zone_set` | `end_zone_set` | 1182 |
| `group` | `end_group` | 5418-5421 |
| `callback` | `end_callback` | 1220 |
| `script_struct` | `end_script_struct` | 5925-5927 |

### 1.6 Interface & Output Blocks (接口与输出块)

| 开始关键字 | 结束关键字 | wsf.ag 行号 |
|:---|:---|:---|
| `dis_interface` | `end_dis_interface` | 4344 |
| `xio_interface` | `end_xio_interface` | 4377 |
| `event_output` | `end_event_output` | 4570 |
| `csv_event_output` | `end_csv_event_output` | 4569 |
| `event_pipe` | `end_event_pipe` | 6007 |

### 1.7 Model Definition Blocks (模型定义块)

使用 `<name> <base_type>` 形式定义，可在 root 使用。

| 开始关键字 | 结束关键字 | wsf.ag 行号 |
|:---|:---|:---|
| `propagation` / `propagation_model` | `end_propagation` / `end_propagation_model` | 5906 (via rule) |
| `attenuation` / `attenuation_model` | `end_attenuation` / `end_attenuation_model` | 5905 (via rule) |
| `clutter` / `clutter_model` | `end_clutter` / `end_clutter_model` | 5907 (via rule) |
| `error_model` | `end_error_model` | 4088 |
| `filter` | `end_filter` | 4920 |

### 1.8 Traffic Blocks (交通块)

| 开始关键字 | 结束关键字 | wsf.ag 行号 |
|:---|:---|:---|
| `air_traffic` | `end_air_traffic` | 5910 |
| `sea_traffic` | `end_sea_traffic` | 5481-5482 |
| `road_traffic` | `end_road_traffic` | 5911 (via rule) |
| `osm_traffic` | `end_osm_traffic` | 5582 |

### 1.9 Other Root Blocks (其他顶层块)

| 开始关键字 | 结束关键字 | wsf.ag 行号 |
|:---|:---|:---|
| `observer` | `end_observer` | 5783 |
| `draw` | `end_draw` | 5429 |
| `conditionals` | `end_conditionals` | 5240 |

---

## 2. Platform-Level Blocks (平台级块)

在 `platform_type` 或 `platform` 内部出现 (Platform struct, line 1226)。

### 2.1 Component Instance Blocks (组件实例块)

**platform_type 内部** (type-command, line 1265):

| 开始关键字 | 结束关键字 | 语法 | 行号 |
|:---|:---|:---|:---|
| `mover` | `end_mover` | `mover <type> ... end_mover` | 1266 |
| `fuel` | `end_fuel` | `fuel <type> ... end_fuel` | 1269 |
| `processor` | `end_processor` | `processor <name> <type> ... end_processor` | 1272 |
| `sensor` | `end_sensor` | `sensor <name> <type> ... end_sensor` | 1275 |
| `comm` | `end_comm` | `comm <name> <type> ... end_comm` | 1278 |
| `router` | `end_router` | `router <name> <type> ... end_router` | 1281 |
| `visual_part` | `end_visual_part` | `visual_part <name> <type> ... end_visual_part` | 1284 |
| `thermal_system` | `end_thermal_system` | `thermal_system <name> <type> ... end_thermal_system` | 1287 |

**platform (instance) 内部** — 带 `add`/`edit`/`delete` 前缀 (instance-command, line 1292 & 1385+):

| 语法 | 行号 |
|:---|:---|
| `add mover <type> ... end_mover` | 1385 |
| `edit mover ... end_mover` | 1386 |
| `add fuel <type> ... end_fuel` | 1388 |
| `edit fuel ... end_fuel` | 1389 |
| `add processor <name> <type> ... end_processor` | 1391 |
| `edit processor <name> ... end_processor` | 1392 |
| `add sensor <name> <type> ... end_sensor` | 1394 |
| `edit sensor <name> ... end_sensor` | 1395 |
| `add comm <name> <type> ... end_comm` | 1397 |
| `edit comm <name> ... end_comm` | 1398 |
| `add router <name> <type> ... end_router` | 1400 |
| `edit router <name> ... end_router` | 1401 |
| `add visual_part <name> <type> ... end_visual_part` | 1403 |
| `edit visual_part <name> ... end_visual_part` | 1404 |
| `add thermal_system <name> <type> ... end_thermal_system` | 1406 |
| `edit thermal_system <name> ... end_thermal_system` | 1407 |

### 2.2 Other Platform-Level Blocks (其他平台级块)

| 开始关键字 | 结束关键字 | 行号 | 备注 |
|:---|:---|:---|:---|
| `track_manager` | `end_track_manager` | 1363-1365 | |
| `track` | `end_track` | 1380 | |
| `navigation_errors` | `end_navigation_errors` | 1381 | |
| `zone` | `end_zone` | 1382 | 平台内局部 zone |
| `zone_set` | `end_zone_set` | 1383 | |
| `callback` | `end_callback` | 1374 | |
| `use_callback` | `end_use_callback` | 1375 | |

---

## 3. Component-Internal Blocks (组件内部块)

### 3.1 Sensor Internal Blocks (Sensor 内部块)

Base Sensor struct (line 969):

| 开始关键字 | 结束关键字 | 行号 | 备注 |
|:---|:---|:---|:---|
| `scheduler` | `end_scheduler` | 998-1001 | 类型: `default`, `physical_scan`, `sector_scan`, `spin` |

Sensor 子类型中的额外块:

**WSF_RADAR_SENSOR** (line 3816):
| 开始关键字 | 结束关键字 | 备注 |
|:---|:---|:---|
| `mode_template` | `end_mode_template` | 编辑模式模板 |
| `mode` | `end_mode` | 定义/编辑具名模式 |
| `beam` | `end_beam` | 波束配置 |
| `frequency_list` | `end_frequency_list` | 频率列表 |
| `transmitter` | `end_transmitter` | 发射机 (inline in XmtrAntenna) |
| `receiver` | `end_receiver` | 接收机 (inline in RcvrAntenna) |

**WSF_PASSIVE_SENSOR** (line 3594):
| 开始关键字 | 结束关键字 | 备注 |
|:---|:---|:---|
| `mode_template` | `end_mode_template` | |
| `mode` | `end_mode` | |
| `beam` | `end_beam` | |
| `receiver` | `end_receiver` | |
| `reported_emitter_type` | `end_reported_emitter_type` | |
| `reported_target_type` | `end_reported_target_type` | |
| `detection_sensitivities` | `end_detection_sensitivities` | |
| `detection_thresholds` | `end_detection_thresholds` | |
| `detection_probability` | `end_detection_probability` | |

**WSF_GEOMETRIC_SENSOR** (line 3631):
| 开始关键字 | 结束关键字 | 备注 |
|:---|:---|:---|
| `mode_template` | `end_mode_template` | |
| `mode` | `end_mode` | |
| `pd_range_table` | `end_pd_range_table` | 在 mode 内，`{ <real> <Length> }*` |

**WSF_COMPOSITE_SENSOR** (line 3453):
- 使用 `<mode-command>` 和 `<Sensor>`，无额外特有块。

**Field of View** (在 Sensor mode 中):
| 开始关键字 | 结束关键字 | 类型 | 行号 |
|:---|:---|:---|:---|
| `field_of_view circular` | (inline) | circular | 1621 |
| `field_of_view rectangular` | (inline) | rectangular | 1626 |
| `field_of_view polygonal` | (inline) | polygonal | 1632 |
| `field_of_view equatorial` | (inline) | equatorial | 1637 |

### 3.2 Processor Internal Blocks (Processor 内部块)

**WSF_SCRIPT_PROCESSOR** (line 2709) — 绝大多数 Processor 子类型的基础:

| 开始关键字 | 结束关键字 | 行号 | 备注 |
|:---|:---|:---|:---|
| `behavior_tree` | `end_behavior_tree` | 2783 | 行为树定义 |
| `advanced_behavior_tree` | `end_advanced_behavior_tree` | 2887 | 高级行为树定义 |
| `behavior` | `end_behavior` | 2739-2740 | `edit behavior <name>` |
| `advanced_behavior` | `end_advanced_behavior` | 2741-2742 | `edit advanced_behavior <name>` |
| `state` | `end_state` | 2743, 2466, 2728 | 状态机状态定义 |
| `edit state` | `end_state` | 2743 | 编辑已有状态 |

**Behavior Tree Node Blocks** (behavior-tree-command, line 2755):

| 开始关键字 | 结束关键字 | 行号 |
|:---|:---|:---|
| `sequence` | `end_sequence` | 2772 |
| `sequence_with_memory` | `end_sequence_with_memory` | 2773 |
| `selector` | `end_selector` | 2774 |
| `selector_with_memory` | `end_selector_with_memory` | 2775 |
| `parallel` | `end_parallel` | 2776 |
| `priority_selector` | `end_priority_selector` | 2777 |
| `weighted_random` | `end_weighted_random` | 2778 |

**Advanced Behavior Tree** (advanced-behavior-tree-command, line 2800) — 同上所有节点类型，外加:

| 开始关键字 | 结束关键字 | 行号 |
|:---|:---|:---|
| `decorator` | `end_decorator` | 2846 |

**State Machine** (WSF_STATE_MACHINE_BASE, line 2447):

嵌套在 `state...end_state` 中:
| 开始关键字 | 结束关键字 | 行号 |
|:---|:---|:---|
| `state` (nested) | `end_state` | 2461 |
| `next_state` | `end_next_state` | 2449, 2456 |

> **注意**: 不存在 `state_machine...end_state_machine` 关键字块。`WSF_STATE_MACHINE` 是一个 struct (line 2934, base_type WSF_SCRIPT_PROCESSOR)，状态通过 `state <name> ... end_state` 直接在 processor 块中定义，或通过 `<:WSF_STATE_MACHINE_BASE>` 引入。

**WSF_MESSAGE_PROCESSOR** (line 2565):

| 开始关键字 | 结束关键字 | 行号 |
|:---|:---|:---|
| `process` | `end_process` | 2606-2608 |
| `default_process` | `end_default_process` | 2609-2611 |
| `default_routing` | `end_default_routing` | 2612-2614 |
| `select` | `end_select` | 2589 |

**WSF_EXCHANGE_PROCESSOR** (line 2620):

| 开始关键字 | 结束关键字 | 行号 |
|:---|:---|:---|
| `container` | `end_container` | 2681-2683 |
| `transactor` | `end_transactor` | 2676-2678 |
| `service` | `end_service` | 2639-2641 |
| `commodity` | `end_commodity` | 2644-2646 |
| `edit container` | `end_container` | 2692 |
| `edit transactor` | `end_transactor` | 2693 |

**WSF_TRACK_PROCESSOR** (line 3025):

| 开始关键字 | 结束关键字 | 行号 |
|:---|:---|:---|
| `track_manager` | `end_track_manager` | 3073-3075 |
| `inbound_filter` | `end_inbound_filter` | 3069-3071 |

**WSF_TRACK_MANAGER** (line 2967):

| 开始关键字 | 结束关键字 | 行号 |
|:---|:---|:---|
| `correlation_method` | `end_correlation_method` | 3004-3007 |
| `fusion_method` | `end_fusion_method` | 3008-3010 |
| `tracker_type` | `end_tracker_type` | 3011 |
| `aux_data_fusion_rules` | `end_aux_data_fusion_rules` | 3016-3018 |
| `track` | `end_track` | 3019 |

### 3.3 Comm Internal Blocks (Comm 内部块)

**WSF_RADIO_TRANSCEIVER** (line 2189):

包含 `<DatalinkLayer>`, `<PhysicalLayer>`, `<CommComponentHardware>` 等规则。具体块由子 struct 提供。

### 3.4 Network Internal Blocks (Network 内部块)

**WSF_COMM_NETWORK_AD_HOC** (line 2409):

| 开始关键字 | 结束关键字 | 行号 |
|:---|:---|:---|
| `powers` | `end_powers` | (在 AD_HOC network 中) |

### 3.5 Fuel Internal Blocks (Fuel 内部块)

**WSF_TABULAR_RATE_FUEL** (line 3173):

| 开始关键字 | 结束关键字 | 行号 |
|:---|:---|:---|
| `fuel_table` | `end_fuel_table` | 3208 |
| `speeds` | `end_speeds` | 3190-3191 |
| `altitudes` | `end_altitudes` | 3194-3195 |
| `weights` / `masses` | `end_weights` / `end_masses` | 3196-3201 |
| `mach` | `end_mach` | 3202-3204 |
| `rates` | `end_rates` | 3205 |

**WSF_VARIABLE_RATE_FUEL** (line 3213):

| 开始关键字 | 结束关键字 | 行号 |
|:---|:---|:---|
| `rates` | `end_rates` | 3224 |

### 3.6 Misc Component Blocks (其他组件块)

**DIS Interface** (DISInterface, line 4172):

| 开始关键字 | 结束关键字 | 行号 |
|:---|:---|:---|
| `connections` | `end_connections` | 4304 |
| `edit_connections` | `end_edit_connections` | 4305 |
| `filtered_connection` | `end_filtered_connection` | 4306 |
| `articulated_part` | `end_articulated_part` | 4314 |
| `entity_appearance` | `end_entity_appearance` | 4317 |
| `dis_exchange` | `end_dis_exchange` | 4318 |

**Signal Processor** (line 5951):

| 开始关键字 | 结束关键字 | 行号 |
|:---|:---|:---|
| `signal_processor` | `end_signal_processor` | 5953-5958 |

---

## 4. Script Embedding Blocks (脚本嵌入块)

### 4.1 Pure Script Entry Blocks (纯脚本入口)

这些块触发 lexer 的 `PUSH_MODE(SCRIPT_MODE)`，内部由 `ScriptParser` 处理。

| 开始关键字 | 结束关键字 | 定义位置 | 备注 |
|:---|:---|:---|:---|
| `script` | `end_script` | global-script-context-command via script-block (1934) | `SCRIPT_FUNC_MODE` — 支持函数定义 |
| `script_variables` | `end_script_variables` | script-variables-block (1931) | 变量声明区 |
| `precondition` | `end_precondition` | behavior-tree-command (2766), advanced (2831) | 行为树前置条件 |
| `execute` | `end_execute` | behavior-tree-node-command (2747), advanced (2832) | 行为树执行块 |
| `execute at_time` | `end_execute` | global-script-context-command (1919) | 定时执行 |
| `execute at_interval_of` | `end_execute` | global-script-context-command (1920) | 周期执行 |

### 4.2 Event Container Shells (事件容器壳)

WSF_MODE 下的事件块，内部包含 `<ScriptBlock>*`。

**object-script-context-command** (line 1923) — 可用于 Sensor, Platform, Processor (WSF_SCRIPT_PROCESSOR), Fuel:

| 开始关键字 | 结束关键字 | 行号 |
|:---|:---|:---|
| `on_initialize` | `end_on_initialize` | 1918 (via global-script-context-command) |
| `on_initialize2` | `end_on_initialize2` | 1926 |
| `on_update` | `end_on_update` | 1927 |

**可用范围** (通过 `<object-script-context-command>` 引用):
- **Platform** — line 1367
- **Sensor** — line 1007
- **WSF_SCRIPT_PROCESSOR** — line 2734
- **Fuel** — line 3169
- **Behavior tree node** — line 2750 (behavior-tree-node-command)
- **Advanced behavior tree node** — line 2793 (advanced-behavior-tree-node-command)

> **注意**: Observer **不支持** `on_initialize`/`on_update`/`on_message`。Observer 使用完全不同的 `enable <event_type> [script]` / `disable <event_type>` 模式 (line 5777-5780)。

**object-message-script-command** (line 1904):

| 开始关键字 | 结束关键字 | 行号 |
|:---|:---|:---|
| `on_message` | `end_on_message` | 1905 |

**可用范围**:
- **WSF_SCRIPT_PROCESSOR** — line 2733
- **Behavior tree node** — line 2752
- **Advanced behavior tree node** — line 2795

### 4.3 State Machine Event Blocks (状态机事件块)

在 `state...end_state` 内部 (state-command, line 2455; WSF_SCRIPT_PROCESSOR line 2722):

| 开始关键字 | 结束关键字 | 行号 |
|:---|:---|:---|
| `on_entry` | `end_on_entry` | 2450, 2457, 2717, 2724 |
| `on_exit` | `end_on_exit` | 2451, 2458, 2718, 2725 |
| `next_state` | `end_next_state` | 2449, 2456, 2716, 2723 |

### 4.4 Fuel Event Blocks (燃料事件块)

在 Fuel struct (line 3143) 中:

| 开始关键字 | 结束关键字 | 行号 |
|:---|:---|:---|
| `on_bingo` | `end_on_bingo` | 3163 |
| `on_empty` | `end_on_empty` | 3164 |
| `on_refuel` | `end_on_refuel` | 3165 |
| `on_reserve` | `end_on_reserve` | 3166 |

### 4.5 Track Event Blocks (跟踪事件块)

在 WSF_TRACK_STATE_CONTROLLER (line 3079) 中:

| 开始关键字 | 结束关键字 | 行号 |
|:---|:---|:---|
| `on_track_drop` | `end_on_track_drop` | 3090 |

### 4.6 Behavior Tree Event Blocks (行为树事件块)

在 behavior-tree-command (line 2755) 和 advanced-behavior-tree-command (line 2800) 中:

| 开始关键字 | 结束关键字 | 行号 |
|:---|:---|:---|
| `on_new_execute` | `end_on_new_execute` | 2767, 2838 |
| `on_new_fail` | `end_on_new_fail` | 2768, 2839 |

在 behavior-tree-node-command (line 2746) 和 advanced (line 2789) 中:

| 开始关键字 | 结束关键字 | 行号 |
|:---|:---|:---|
| `on_init` | `end_on_init` | 2748, 2833 |

### 4.7 Track Manager Event Blocks

在 default-fusion-method-command (line 2996) 中:

| 开始关键字 | 结束关键字 | 行号 |
|:---|:---|:---|
| `on_type_update` | `end_on_type_update` | 2997 |

---

## 5. Inheritance Hierarchy (继承层级)

所有 `:base_type` 关系，从 wsf.ag 中提取。

### 5.1 PlatformPart 体系

```
PlatformPart (line 785)
├── ArticulatedPart (line 822)
│   ├── Sensor (line 969)
│   │   ├── WSF_COMPOSITE_SENSOR (line 3453)
│   │   ├── WSF_PASSIVE_SENSOR (line 3594)
│   │   ├── WSF_GEOMETRIC_SENSOR (line 3631)
│   │   ├── WSF_NULL_SENSOR (line 3647)
│   │   └── WSF_RADAR_SENSOR (line 3816)
│   ├── Comm (line 2112)
│   │   ├── WSF_COMM_TRANSCEIVER (line 2158)
│   │   │   ├── WSF_COMM_RCVR (line 2171)
│   │   │   └── WSF_COMM_XMTR (line 2180)
│   │   └── WSF_RADIO_TRANSCEIVER (line 2189)
│   │       ├── WSF_RADIO_RCVR (line 2220)
│   │       └── WSF_RADIO_XMTR (line 2230)
│   ├── WSF_VISUAL_PART (line 3439)
│   └── (XmtrRcvrBase → Transmitter, Receiver)
├── Processor (line 2438)
│   ├── WSF_PERFECT_TRACKER (line 2703)
│   ├── WSF_LINKED_PROCESSOR (line 6011)
│   │   └── WSF_DIRECTION_FINDER_PROCESSOR (line 2531)
│   ├── WSF_SCRIPT_PROCESSOR (line 2709)
│   │   ├── WSF_LINKED_SCRIPT_PROCESSOR (line 2558)
│   │   ├── WSF_MESSAGE_PROCESSOR (line 2565)
│   │   │   └── WSF_DELAY_PROCESSOR (line 2518)
│   │   ├── WSF_EXCHANGE_PROCESSOR (line 2620)
│   │   ├── WSF_MOVE_PLAN_PROCESSOR (line 2697)
│   │   ├── WSF_STATE_MACHINE (line 2934)
│   │   ├── WSF_TASK_PROCESSOR (line 2944)
│   │   ├── WSF_TRACK_PROCESSOR (line 3025)
│   │   └── WSF_TRACK_STATE_CONTROLLER (line 3079)
│   └── SensorProcessor (line 6020)
├── Router (line 2052)
│   └── WSF_COMM_ROUTER (line 2094)
├── Mover (line 4522)
│   ├── WSF_ROUTE_MOVER (line 1804)
│   │   ├── WSF_WAYPOINT_MOVER (line 1838)
│   │   │   ├── WSF_AIR_MOVER (line 3318)
│   │   │   ├── WSF_GROUND_MOVER (line 3327)
│   │   │   │   └── WSF_ROAD_MOVER (line 3334)
│   │   │   └── WSF_SURFACE_MOVER (line 3418)
│   │   ├── WSF_ITERATIVE_MOVER (line 3425)
│   │   │   └── WSF_ROTORCRAFT_MOVER (line 3374)
│   │   └── WSF_KINEMATIC_MOVER (line 3392)
│   ├── WSF_HYBRID_MOVER (line 3254)
│   ├── WSF_OFFSET_MOVER (line 3273)
│   └── WSF_TSPI_MOVER (line 3285)
└── Fuel (line 3143)
    ├── WSF_TABULAR_RATE_FUEL (line 3173)
    │   └── WSF_TANKED_FUEL (line 3233)
    └── WSF_VARIABLE_RATE_FUEL (line 3213)
```

### 5.2 Platform 体系

```
Platform (line 1226)
└── WSF_PLATFORM (line 1414)
```

### 5.3 Network 体系

```
Network (line 2298)
├── WSF_COMM_NETWORK_GENERIC (line 2336)
│   └── WSF_COMM_NETWORK_AD_HOC (line 2409)
├── WSF_COMM_NETWORK_P2P (line 2347)
├── WSF_COMM_NETWORK_MESH (line 2357)
├── WSF_COMM_NETWORK_MESH_LEGACY (line 2367)
├── WSF_COMM_NETWORK_STAR (line 2377)
├── WSF_COMM_NETWORK_RING (line 2389)
└── WSF_COMM_NETWORK_DIRECTED_RING (line 2399)
```

### 5.4 Medium 体系

```
Medium (line 1939)
└── WSF_COMM_MEDIUM_GUIDED (line 1950)
    └── WSF_COMM_MEDIUM_UNGUIDED (line 1964)
```

### 5.5 Protocol 体系

```
Protocol (line 1980)
└── WSF_COMM_PROTOCOL_IGMP (line 2002)
```

### 5.6 RouterProtocol 体系

```
RouterProtocol (line 1988)
├── WSF_COMM_ROUTER_PROTOCOL_LEGACY (line 1996)
├── WSF_COMM_ROUTER_PROTOCOL_MULTICAST (line 2012)
├── WSF_COMM_ROUTER_PROTOCOL_RIPv2 (line 2018)
├── WSF_COMM_ROUTER_PROTOCOL_OSPF (line 2028)
└── WSF_COMM_ROUTER_PROTOCOL_AD_HOC (line 2041)
```

### 5.7 Filter 体系

```
Filter (line 4912)
├── WSF_ALPHA_BETA_FILTER (line 4932)
├── WSF_ALPHA_BETA_GAMMA_FILTER (line 4942)
├── WSF_KALMAN_FILTER (line 4954)
└── WSF_KALMAN_FILTER_2D_RB (line 4967)
```

### 5.8 ErrorModel 体系

```
ErrorModel (line 4106)
├── WSF_ERROR_NULL (line 4113)
├── WSF_ERROR_STANDARD (line 4118)
├── WSF_ERROR_RADAR (line 4123)
└── WSF_ERROR_ABSOLUTE (line 4128)
```

### 5.9 Clutter 体系

```
Clutter (line 4053)
└── WSF_SURFACE_CLUTTER_TABLE (line 4063)
(WSF_CLUTTER_NULL (line 4060) — no base_type, standalone)
```

### 5.10 Propagation Models (无继承链)

```
WSF_NULL_PROPAGATION (line 3886)
WSF_FAST_MULTIPATH (line 3889)
WSF_GROUND_WAVE_PROPAGATION (line 3900)
```

### 5.11 Attenuation Models (无继承链)

```
WSF_BLAKE_ATTENUATION (line 3964)
WSF_ITU_ATTENUATION (line 3971)
WSF_SIMPLE_ATTENUATION (line 3987)
WSF_TABULAR_ATTENUATION (line 3996)
```

### 5.12 Sensor Mode 体系

```
WSF_SENSOR_MODE (line 1684)
├── WSF_PASSIVE_SENSOR_mode (line 3567)
├── WSF_GEOMETRIC_SENSOR_mode (line 3613)
└── WSF_RADAR_SENSOR_mode (line 3790)
```

### 5.13 Zone 体系

```
Zone (line 5049)
├── ZoneSet (line 5062)
└── ZoneDefinition (line 5091)
```

### 5.14 Signal Processor 体系 (无继承链)

```
scale_factor (line 5941)
constant_clutter_suppression (line 5946)
```

---

## 6. Special Syntax Notes (特殊语法备注)

### 6.1 Inline Variable Push (`<$var>`)

以下 struct 不使用 `keyword...end_keyword` 包裹，而是通过 `<$variable>` 在父作用域内联展开其命令:

| struct | 引用方式 | 父作用域 | 行号 |
|:---|:---|:---|:---|
| `Scenario` | `<$scenario>` | root | 1192 |
| `DISInterface` | `<$disInterface>` | root | 1221 |
| `Terrain` | `<$terrain>` | root | 1222 |
| `SimulationInput` | `<$simulationInput>` | Scenario | 5392 |
| `ScriptManager` | `<$scriptManager>` | Scenario | 5395 |
| `ExternalLinks` | `<$externalLinks>` | WSF_SCRIPT_PROCESSOR, WSF_LINKED_PROCESSOR | 2735, 6015 |

### 6.2 Observer Block

Observer (line 5783) 的语法与其他块不同，使用 `enable`/`disable` 事件模式:

```
observer
   enable <EVENT_TYPE> [<script_string>]
   disable <EVENT_TYPE> [<script_string>]
end_observer
```

不支持 `on_initialize`, `on_update`, `on_message` 等脚本上下文。

### 6.3 Conditionals

```
conditionals
   feature_present <string>
   feature_not_present <string>
   wsf_version <operator> <version>
   type_present <string>
   type_not_present <string>
end_conditionals
```

### 6.4 Draw

```
draw {route|route_network} <name> [color/layer/line_size/point_size]* end_draw
```

### 6.5 Script Struct

```
script_struct <name>
   script_variables ... end_script_variables
   script ... end_script
   uncloneable
end_script_struct
```

### 6.6 Scenario Commands (内联在 root 作用域)

Scenario 的命令直接出现在 root 中（通过 `<$scenario>` 展开），包括:
- `end_time`, `start_date`, `start_time`, `clock_rate`
- `classification ... end_classification`
- `classification_levels ... end_classification_levels`
- `platform_availability ... end_platform_availability`
- `iff_mapping ... end_iff_mapping`
- `random_seeds ... end_random_seeds`
- `script_interface ... end_script_interface`
- 所有 `SimulationInput` 命令

### 6.7 Attenuation/Clutter/Propagation 双关键字

这些模型支持两种等效的关键字:
- `attenuation` / `end_attenuation` 或 `attenuation_model` / `end_attenuation_model`
- `clutter` / `end_clutter` 或 `clutter_model` / `end_clutter_model`
- `propagation` / `end_propagation` 或 `propagation_model` / `end_propagation_model`
