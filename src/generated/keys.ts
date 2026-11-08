import '@servicenow/sdk/global'

declare global {
    namespace Now {
        namespace Internal {
            interface Keys extends KeysRegistry {
                explicit: {
                    action_invoke_bedrock: {
                        table: 'sys_hub_action_type_definition'
                        id: '067ce6262f224c12b03f882bc245f329'
                    }
                    api_agent_callback: {
                        table: 'sys_ws_definition'
                        id: 'd1137e8b82c7410a9745e0d24af4467a'
                    }
                    audit_call_failed: {
                        table: 'sys_hub_flow_logic_instance_v2'
                        id: 'a382bd8513244e8ea2b1598b430eeb6c'
                    }
                    block_for_human_review: {
                        table: 'sys_hub_action_instance_v2'
                        id: '5a2ee56354524d3890d0119139a1acf7'
                    }
                    bom_json: {
                        table: 'sys_module'
                        id: 'cce82fd5a103432f87c664bdab8679ec'
                    }
                    call_bedrock_audit: {
                        table: 'sys_hub_action_instance_v2'
                        id: 'd28d339b0114471faf7b406061782a44'
                    }
                    flow_audit_credit_exception: {
                        table: 'sys_hub_flow'
                        id: 'fbd98944de2f46f08190c3e0cf9a2052'
                    }
                    header_agent_callback_token: {
                        table: 'sys_ws_header'
                        id: '4421ef76c1e34c4f9a3b025e7b566287'
                    }
                    list_category_credit: {
                        table: 'sys_ux_list_category'
                        id: '3fb26837d2564c248d474b8a8353fdc4'
                    }
                    list_credit_exceptions: {
                        table: 'sys_ux_list'
                        id: '0afdec117991479991ab63fb7d1415a5'
                    }
                    list_menu_credit_exceptions: {
                        table: 'sys_ux_list_menu_config'
                        id: '236dccc889b64d668448575e56566f98'
                    }
                    lookup_customer_metrics: {
                        table: 'sys_hub_action_instance_v2'
                        id: '129ce85b9265462baf9d79637f2cb1b2'
                    }
                    package_json: {
                        table: 'sys_module'
                        id: '5dc73f00ab7148d2842f0d83edd3e871'
                    }
                    prop_aws_access_key: {
                        table: 'sys_properties'
                        id: 'e67344c038154e15a8e94abe6d72a6e4'
                    }
                    prop_aws_bedrock_endpoint: {
                        table: 'sys_properties'
                        id: '69cf21d2c6b649e58a5102ead42532cf'
                    }
                    prop_aws_model_id: {
                        table: 'sys_properties'
                        id: '593528b591dc4cac8345e848cb7dedcf'
                    }
                    prop_aws_region: {
                        table: 'sys_properties'
                        id: 'a1128e57f9c14eb3b60aca64543e7d27'
                    }
                    prop_aws_secret_key: {
                        table: 'sys_properties'
                        id: '37941aeaa37c44729a47eb1b1baa34ad'
                    }
                    prop_callback_token: {
                        table: 'sys_properties'
                        id: '8b47b94897954821bf56c30223bf2251'
                    }
                    route_agent_callback: {
                        table: 'sys_ws_operation'
                        id: 'd2f5950ffabc484da43455dec16de0a0'
                    }
                    step_invoke_bedrock: {
                        table: 'sys_hub_step_instance'
                        id: '82daef6cb25e4bc5a076212b0433baad'
                    }
                    trigger_credit_exception_processing: {
                        table: 'sys_hub_trigger_instance_v2'
                        id: '2b735bb9a80c47e5bc973c0d2752af3c'
                    }
                    ui_action_run_agentic_audit: {
                        table: 'sys_ui_action'
                        id: 'b668003512d1445fa2cb77f164f2b18f'
                    }
                    workspace_erp_overlay: {
                        table: 'sys_ux_page_registry'
                        id: '81b727ec595b4d3faedacf99846eadaf'
                    }
                    workspace_erp_overlay_sys_ux_app_config_workspace: {
                        table: 'sys_ux_app_config'
                        id: 'c467154a73224f59b4a43ccf4f33ee3d'
                    }
                    workspace_erp_overlay_sys_ux_app_route_home: {
                        table: 'sys_ux_app_route'
                        id: 'fa84831c24bf46838483d2a7cb8505c5'
                    }
                    workspace_erp_overlay_sys_ux_app_route_list: {
                        table: 'sys_ux_app_route'
                        id: 'c417257b437e4b9e9df59198271bb460'
                    }
                    workspace_erp_overlay_sys_ux_app_route_record: {
                        table: 'sys_ux_app_route'
                        id: 'e4e48e22f97f435aa80bc06084694972'
                    }
                    'workspace_erp_overlay_sys_ux_app_route_simple-list': {
                        table: 'sys_ux_app_route'
                        id: '72ce9197c7e64154ae6a2b4d027fcb72'
                    }
                    workspace_erp_overlay_sys_ux_macroponent_record: {
                        table: 'sys_ux_macroponent'
                        id: 'ffd23427035348dd83e57a53755d906e'
                    }
                    workspace_erp_overlay_sys_ux_page_property_chrome_footer: {
                        table: 'sys_ux_page_property'
                        id: '4bf0cfb3afe44b508fbf90c0f075aa2d'
                    }
                    workspace_erp_overlay_sys_ux_page_property_chrome_header: {
                        table: 'sys_ux_page_property'
                        id: 'd0af2b9ab57f41379a8f7b7640311e91'
                    }
                    workspace_erp_overlay_sys_ux_page_property_chrome_tab: {
                        table: 'sys_ux_page_property'
                        id: 'b942d13eff304e868720d86e50a2d7f5'
                    }
                    workspace_erp_overlay_sys_ux_page_property_chrome_toolbar: {
                        table: 'sys_ux_page_property'
                        id: '1d36b3238bad44178015d15711625e2e'
                    }
                    workspace_erp_overlay_sys_ux_page_property_listConfigId: {
                        table: 'sys_ux_page_property'
                        id: '29ef2cd42161432b8b19574cadde6d64'
                    }
                    workspace_erp_overlay_sys_ux_page_property_view: {
                        table: 'sys_ux_page_property'
                        id: '3c83950f16c442279a6c3585d3b13f2a'
                    }
                    workspace_erp_overlay_sys_ux_page_property_wbApplicabilityConfigId: {
                        table: 'sys_ux_page_property'
                        id: '59e50f26d00c48ccb6a6088c53fc7d9e'
                    }
                    workspace_erp_overlay_sys_ux_registry_m2m_category_unifiedNav: {
                        table: 'sys_ux_registry_m2m_category'
                        id: '58e057899b0a47528b0255d48f614667'
                    }
                    workspace_erp_overlay_sys_ux_screen_home: {
                        table: 'sys_ux_screen'
                        id: '2fa75afb74aa4ee6af4a4fd6bd567c94'
                    }
                    workspace_erp_overlay_sys_ux_screen_list: {
                        table: 'sys_ux_screen'
                        id: 'c99977795bc8477fae722113700279e7'
                    }
                    workspace_erp_overlay_sys_ux_screen_record: {
                        table: 'sys_ux_screen'
                        id: 'aff6f0b9b2834d1abfadfaf0e42260ba'
                    }
                    'workspace_erp_overlay_sys_ux_screen_simple-list': {
                        table: 'sys_ux_screen'
                        id: '9be2b6e365324f4993e5c9494090ffd2'
                    }
                    workspace_erp_overlay_sys_ux_screen_type_home: {
                        table: 'sys_ux_screen_type'
                        id: 'f6f2f5ae12ce4603a4b68b7eb79226ac'
                    }
                    workspace_erp_overlay_sys_ux_screen_type_list: {
                        table: 'sys_ux_screen_type'
                        id: '8153af601b61484d9296d95249e7be14'
                    }
                    workspace_erp_overlay_sys_ux_screen_type_record: {
                        table: 'sys_ux_screen_type'
                        id: '42c628c056684e30bc6ac3fcdc46f4a4'
                    }
                    'workspace_erp_overlay_sys_ux_screen_type_simple-list': {
                        table: 'sys_ux_screen_type'
                        id: 'b1803bae8ca4431cbc91903a6f0614e0'
                    }
                }
                composite: [
                    {
                        table: 'sys_documentation'
                        id: '00e7083601f4495eab9f5c61887edd56'
                        key: {
                            name: 'var__m_sys_hub_action_input_067ce6262f224c12b03f882bc245f329'
                            element: 'customer_id'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '0361f691f1b74b9e8e9d598954c83fc0'
                        key: {
                            name: 'x_ent_erp_ovl_customer_metrics'
                            element: 'customer_id'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '04d1bc82a00548638adc762427c02b68'
                        key: {
                            id: '82daef6cb25e4bc5a076212b0433baad'
                            table: 'var__m_sys_hub_step_ext_input_82daef6cb25e4bc5a076212b0433baad'
                            field: 'past_due'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '06d2420a4400473f84fb6ade3f138904'
                        key: {
                            name: 'var__m_sys_hub_action_input_067ce6262f224c12b03f882bc245f329'
                            element: 'order_id'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '082303f09e6b4fe7a899b307b218d5c7'
                        key: {
                            name: 'x_ent_erp_ovl_customer_metrics'
                            element: 'risk_tier'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_list'
                        id: '0bbfd3b545a644ffae73c4136dd0f35e'
                        key: {
                            name: 'x_ent_erp_ovl_credit_exceptions'
                            view: {
                                id: 'c97976abf8b44ee98927114204a4f0f1'
                                key: {
                                    name: 'Default'
                                }
                            }
                            sys_domain: 'global'
                            element: 'NULL'
                            relationship: 'NULL'
                            parent: 'NULL'
                        }
                    },
                    {
                        table: 'sys_hub_action_input'
                        id: '0c3afd7aac7a4787ac16d62708c5a37e'
                        key: {
                            model: '067ce6262f224c12b03f882bc245f329'
                            element: 'amount'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '0c54a15423fa4fc2ae6089f9a5b90f1c'
                        key: {
                            name: 'var__m_sys_hub_action_input_067ce6262f224c12b03f882bc245f329'
                            element: 'customer_metrics'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '102ae3007be540e281cb1d3a272e3deb'
                        key: {
                            name: 'var__m_sys_hub_action_output_067ce6262f224c12b03f882bc245f329'
                            element: '__dont_treat_as_error__'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_hub_action_input'
                        id: '13afc468dc7941919c0dcd33ba74b705'
                        key: {
                            model: '067ce6262f224c12b03f882bc245f329'
                            element: 'order_id'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '16e549698cae4d02bcae5168604aff82'
                        key: {
                            name: 'x_ent_erp_ovl_credit_exceptions'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_hub_action_output'
                        id: '200cadb9df824b318d19ae555d4aa3fa'
                        key: {
                            model: '067ce6262f224c12b03f882bc245f329'
                            element: '__action_status__'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '2016caf34d57408d94fa4427f14ea75f'
                        key: {
                            name: 'x_ent_erp_ovl_customer_metrics'
                            element: 'customer_id'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '2471b0640a8741efa5803070694cbec0'
                        key: {
                            name: 'x_ent_erp_ovl_customer_metrics'
                            element: 'risk_tier'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '24ea0f99f135483c8228a0666d63e51a'
                        key: {
                            name: 'x_ent_erp_ovl_credit_exceptions'
                            element: 'ai_justification'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '2b6657ef116f4b70a6068369d8678787'
                        key: {
                            name: 'x_ent_erp_ovl_credit_exceptions'
                            element: 'amount'
                        }
                    },
                    {
                        table: 'sys_hub_action_output'
                        id: '2d8f2a0c27ae40c196ec19722dc4f1aa'
                        key: {
                            model: '067ce6262f224c12b03f882bc245f329'
                            element: 'error'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '2dff70c0fb8f4571840e4b87ca414b95'
                        key: {
                            list_id: {
                                id: '0bbfd3b545a644ffae73c4136dd0f35e'
                                key: {
                                    name: 'x_ent_erp_ovl_credit_exceptions'
                                    view: {
                                        id: 'c97976abf8b44ee98927114204a4f0f1'
                                        key: {
                                            name: 'Default'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'sys_updated_on'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '2eae0adc72e646cea40ae05f4bceb4d5'
                        key: {
                            name: 'x_ent_erp_ovl_customer_metrics'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '2f4ddbcbae334f50a1426b232858a711'
                        key: {
                            name: 'x_ent_erp_ovl_credit_exceptions'
                            element: 'ai_justification'
                        }
                    },
                    {
                        table: 'sys_hub_action_output'
                        id: '3009fe9774d4437fa3360a26fe9ebf07'
                        key: {
                            model: '067ce6262f224c12b03f882bc245f329'
                            element: 'body'
                        }
                    },
                    {
                        table: 'sys_hub_step_ext_input'
                        id: '314e686341744c0f8887beb111f5dd3a'
                        key: {
                            model: '82daef6cb25e4bc5a076212b0433baad'
                            element: 'risk_tier'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '37e35f33bda7459b9ccee6cbb7710b24'
                        key: {
                            name: 'var__m_sys_hub_action_input_067ce6262f224c12b03f882bc245f329'
                            element: 'amount'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_hub_step_ext_input'
                        id: '38b59818b33a4bf3a9b4496bd927d51f'
                        key: {
                            model: '82daef6cb25e4bc5a076212b0433baad'
                            element: 'order_id'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '38b9aeb9cb2c4fa9bd19fbde40c2c4ba'
                        key: {
                            name: 'x_ent_erp_ovl_credit_exceptions'
                            element: 'current_status'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '41a9e94023364b50a837a2f4d08ba9d8'
                        key: {
                            id: '82daef6cb25e4bc5a076212b0433baad'
                            table: 'var__m_sys_hub_step_ext_input_82daef6cb25e4bc5a076212b0433baad'
                            field: 'exposure'
                        }
                    },
                    {
                        table: 'sys_hub_step_ext_output'
                        id: '435444f8912c417a93744270bc72c8bf'
                        key: {
                            model: '82daef6cb25e4bc5a076212b0433baad'
                            element: 'timed_out'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '4733da7b61fd4baa853929e287a2791e'
                        key: {
                            name: 'x_ent_erp_ovl_credit_exceptions'
                            element: 'customer_id'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '475dd7475d1141d8989fd2569ab91223'
                        key: {
                            name: 'x_ent_erp_ovl_credit_exceptions'
                            element: 'current_status'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '4b95281a457646beb0a5ba8e897b2513'
                        key: {
                            name: 'x_ent_erp_ovl_credit_exceptions'
                            element: 'order_id'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '5177511228bd42bfa5aa9d49e6e73078'
                        key: {
                            name: 'x_ent_erp_ovl_customer_metrics'
                            element: 'exposure'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '55f1cf52c49a49f6a958441f14ad6d33'
                        key: {
                            id: '82daef6cb25e4bc5a076212b0433baad'
                            table: 'var__m_sys_hub_step_ext_input_82daef6cb25e4bc5a076212b0433baad'
                            field: 'order_id'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '5a064dd10350463b810d26d4f3d663b2'
                        key: {
                            name: 'x_ent_erp_ovl_customer_metrics'
                            element: 'past_due'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '62f6aaeb58254186a7997a41f24c79cf'
                        key: {
                            id: '82daef6cb25e4bc5a076212b0433baad'
                            table: 'var__m_sys_hub_step_ext_input_82daef6cb25e4bc5a076212b0433baad'
                            field: 'risk_tier'
                        }
                    },
                    {
                        table: 'sys_hub_step_ext_output'
                        id: '6615c98e9c96495aba7def6c8abb76a9'
                        key: {
                            model: '82daef6cb25e4bc5a076212b0433baad'
                            element: 'body'
                        }
                    },
                    {
                        table: 'sys_hub_step_ext_output'
                        id: '663139b00dd04aca95008047d5e763ef'
                        key: {
                            model: '82daef6cb25e4bc5a076212b0433baad'
                            element: 'error'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '67d4a4404409463aaa51408fc72bbfcf'
                        key: {
                            list_id: {
                                id: '0bbfd3b545a644ffae73c4136dd0f35e'
                                key: {
                                    name: 'x_ent_erp_ovl_credit_exceptions'
                                    view: {
                                        id: 'c97976abf8b44ee98927114204a4f0f1'
                                        key: {
                                            name: 'Default'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'current_status'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '6bc29da6f59749d48df3711fa1cd476c'
                        key: {
                            name: 'x_ent_erp_ovl_credit_exceptions'
                            element: 'order_id'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '6cb0389466324bcdb1c4b1f937b88f0e'
                        key: {
                            list_id: {
                                id: '0bbfd3b545a644ffae73c4136dd0f35e'
                                key: {
                                    name: 'x_ent_erp_ovl_credit_exceptions'
                                    view: {
                                        id: 'c97976abf8b44ee98927114204a4f0f1'
                                        key: {
                                            name: 'Default'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'customer_id'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '6f94ed48d4fc49fbaa78fc4c62a728aa'
                        key: {
                            name: 'var__m_sys_hub_action_output_067ce6262f224c12b03f882bc245f329'
                            element: '__action_status__'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_hub_step_ext_input'
                        id: '6ff2632b445a4a55a084f607f7531b8a'
                        key: {
                            model: '82daef6cb25e4bc5a076212b0433baad'
                            element: 'exposure'
                        }
                    },
                    {
                        table: 'sys_hub_action_output'
                        id: '71c1fa89017a44a586b5a3b0883e5700'
                        key: {
                            model: '067ce6262f224c12b03f882bc245f329'
                            element: '__dont_treat_as_error__'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '73e56dc5bfd6451497a70f28d1e48784'
                        key: {
                            name: 'x_ent_erp_ovl_credit_exceptions'
                            element: 'amount'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '77bbb3f3bcf84647bbe3ec27df3180cb'
                        key: {
                            list_id: {
                                id: '0bbfd3b545a644ffae73c4136dd0f35e'
                                key: {
                                    name: 'x_ent_erp_ovl_credit_exceptions'
                                    view: {
                                        id: 'c97976abf8b44ee98927114204a4f0f1'
                                        key: {
                                            name: 'Default'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'amount'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '7858485242f548e2899fe463c47c1913'
                        key: {
                            name: 'x_ent_erp_ovl_customer_metrics'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '7b469dc87a67444f8ac53cacc37eb359'
                        key: {
                            name: 'x_ent_erp_ovl_customer_metrics'
                            element: 'past_due'
                        }
                    },
                    {
                        table: 'sys_hub_step_ext_input'
                        id: '7f3c202b119e4a0684df8ddab3294437'
                        key: {
                            model: '82daef6cb25e4bc5a076212b0433baad'
                            element: 'past_due'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '87f7c9e81f804f0ab71e96dcf7f98ff9'
                        key: {
                            name: 'x_ent_erp_ovl_credit_exceptions'
                        }
                    },
                    {
                        table: 'sys_hub_action_input'
                        id: '8805be21e79245e088260538d8473d56'
                        key: {
                            model: '067ce6262f224c12b03f882bc245f329'
                            element: 'customer_id'
                        }
                    },
                    {
                        table: 'sys_user_role'
                        id: '9094b6ad944d4bd2a48889716edc85df'
                        key: {
                            name: 'x_ent_erp_ovl.user'
                        }
                    },
                    {
                        table: 'sys_hub_action_input'
                        id: '99a1225489c84847bc7d899b72edaf05'
                        key: {
                            model: '067ce6262f224c12b03f882bc245f329'
                            element: 'customer_metrics'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '9b4b11ef4ae8472b9ba24c64e6295860'
                        key: {
                            list_id: {
                                id: '0bbfd3b545a644ffae73c4136dd0f35e'
                                key: {
                                    name: 'x_ent_erp_ovl_credit_exceptions'
                                    view: {
                                        id: 'c97976abf8b44ee98927114204a4f0f1'
                                        key: {
                                            name: 'Default'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'order_id'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'a6c0c2881b3e40f4921d482d7c50b555'
                        key: {
                            document_key: '82daef6cb25e4bc5a076212b0433baad'
                            variable: '74315b04b3201300176b051a16a8dc2b'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'a99e2dde12a840dbba1e2474c64f0a62'
                        key: {
                            name: 'x_ent_erp_ovl_credit_exceptions'
                            element: 'current_status'
                            value: 'BLOCKED'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ws_header_map'
                        id: 'ac3d85255c99447fb29a7f5e8c412be3'
                        key: {
                            web_service_operation: 'd2f5950ffabc484da43455dec16de0a0'
                            web_service_header: '4421ef76c1e34c4f9a3b025e7b566287'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'ad479bfc24c64be1a72114fed4731f08'
                        key: {
                            name: 'x_ent_erp_ovl_customer_metrics'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: 'adcfa294cd0f4ee29fef687a5d4d8c59'
                        key: {
                            id: '82daef6cb25e4bc5a076212b0433baad'
                            table: 'var__m_sys_hub_step_ext_input_82daef6cb25e4bc5a076212b0433baad'
                            field: 'limit_amount'
                        }
                    },
                    {
                        table: 'sys_hub_step_ext_input'
                        id: 'af57adba6e044a999f949c650d9d2dd3'
                        key: {
                            model: '82daef6cb25e4bc5a076212b0433baad'
                            element: 'limit_amount'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: 'b0c9fde511c04086a9853e82ee08ac48'
                        key: {
                            id: '82daef6cb25e4bc5a076212b0433baad'
                            table: 'var__m_sys_hub_step_ext_input_82daef6cb25e4bc5a076212b0433baad'
                            field: 'customer_id'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: 'b44b76654abd41f2a5ae3a498ce42068'
                        key: {
                            name: 'x_ent_erp_ovl_credit_exceptions'
                            element: 'current_status'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'b8ad0c69f6b14e3792f8e812445932b5'
                        key: {
                            name: 'var__m_sys_hub_action_output_067ce6262f224c12b03f882bc245f329'
                            element: 'error'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_hub_step_ext_output'
                        id: 'b930def38b9d40f0b8893b6797eb5ada'
                        key: {
                            model: '82daef6cb25e4bc5a076212b0433baad'
                            element: 'status_code'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: 'b964a695f13e4e20921eb738988b6433'
                        key: {
                            id: '067ce6262f224c12b03f882bc245f329'
                            table: 'var__m_sys_hub_action_output_067ce6262f224c12b03f882bc245f329'
                            field: 'error'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'bb214ebf7b8b4a8680304cd58d3ac1e7'
                        key: {
                            name: 'x_ent_erp_ovl_customer_metrics'
                            element: 'limit_amount'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'c21bc5b3cb76482389b2fc704ab1363d'
                        key: {
                            name: 'var__m_sys_hub_action_output_067ce6262f224c12b03f882bc245f329'
                            element: 'body'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_hub_action_output'
                        id: 'c2895777e87b408798f107d3794699e1'
                        key: {
                            model: '067ce6262f224c12b03f882bc245f329'
                            element: 'status_code'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'c7c96bf131104e9298769ed937a11d3c'
                        key: {
                            name: 'x_ent_erp_ovl_customer_metrics'
                            element: 'exposure'
                        }
                    },
                    {
                        table: 'sys_hub_step_ext_input'
                        id: 'ca5feefd260b4a7a9950346cb81db774'
                        key: {
                            model: '82daef6cb25e4bc5a076212b0433baad'
                            element: 'amount'
                        }
                    },
                    {
                        table: 'sys_index'
                        id: 'cb4d4adab87047cc8734255db2318c63'
                        key: {
                            logical_table_name: 'x_ent_erp_ovl_credit_exceptions'
                            col_name_string: 'order_id'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'd64aa463742f405b8d3ab8340050e66e'
                        key: {
                            document_key: '82daef6cb25e4bc5a076212b0433baad'
                            variable: '71aa7f6647032200b4fad7527c9a719b'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'd871dedaddca4cc587c404da96dcc1bd'
                        key: {
                            name: 'x_ent_erp_ovl_credit_exceptions'
                            element: 'current_status'
                            value: 'PROCESSING'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'd8a1be9953eb43e58fbe85a3e332154e'
                        key: {
                            name: 'x_ent_erp_ovl_customer_metrics'
                            element: 'limit_amount'
                        }
                    },
                    {
                        table: 'sys_hub_action_output'
                        id: 'da19f9837ede4659a5335891b157d073'
                        key: {
                            model: '067ce6262f224c12b03f882bc245f329'
                            element: 'timed_out'
                        }
                    },
                    {
                        table: 'sys_hub_step_ext_input'
                        id: 'dc679903482d47eeb70d6a5ddece872d'
                        key: {
                            model: '82daef6cb25e4bc5a076212b0433baad'
                            element: 'customer_id'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'dc9da201dc654d91970761cd297a9f09'
                        key: {
                            name: 'x_ent_erp_ovl_credit_exceptions'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: 'dccebc3191c64f1a8f417cb7b17e82ee'
                        key: {
                            name: 'x_ent_erp_ovl_credit_exceptions'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: 'e40ce06337cb432690dd174f8822dbcb'
                        key: {
                            name: 'x_ent_erp_ovl_customer_metrics'
                        }
                    },
                    {
                        table: 'sys_complex_object'
                        id: 'e7ca87f9d6c1489992da7475c99585a6'
                        key: {
                            name: 'FD99a1225489c84847bc7d899b72edaf05'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'eb1ff23ac98741d497ee05d5b6eb7e38'
                        key: {
                            name: 'x_ent_erp_ovl_credit_exceptions'
                            element: 'customer_id'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'ed1396a2bc0049ed97d5e4ce9095614f'
                        key: {
                            name: 'x_ent_erp_ovl_credit_exceptions'
                            element: 'current_status'
                            value: 'RELEASED'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: 'f07fab6c324549a596b1f645769d5823'
                        key: {
                            id: '82daef6cb25e4bc5a076212b0433baad'
                            table: 'var__m_sys_hub_step_ext_input_82daef6cb25e4bc5a076212b0433baad'
                            field: 'amount'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: 'f5593697c0a247d5a12da988c24d93c2'
                        key: {
                            id: '067ce6262f224c12b03f882bc245f329'
                            table: 'var__m_sys_hub_action_output_067ce6262f224c12b03f882bc245f329'
                            field: 'body'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: 'f798c9ce5209462c91399740a56e7f06'
                        key: {
                            id: '067ce6262f224c12b03f882bc245f329'
                            table: 'var__m_sys_hub_action_output_067ce6262f224c12b03f882bc245f329'
                            field: 'status_code'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'f7a917cb8f1349edbbe6bd502210c5bb'
                        key: {
                            name: 'var__m_sys_hub_action_output_067ce6262f224c12b03f882bc245f329'
                            element: 'timed_out'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: 'fe43cd21a6c4470485eb78d9049216f0'
                        key: {
                            id: '067ce6262f224c12b03f882bc245f329'
                            table: 'var__m_sys_hub_action_output_067ce6262f224c12b03f882bc245f329'
                            field: 'timed_out'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'ffdd2d3a1e354e659aa3d5ca55a7caa8'
                        key: {
                            name: 'var__m_sys_hub_action_output_067ce6262f224c12b03f882bc245f329'
                            element: 'status_code'
                            language: 'en'
                        }
                    },
                ]
            }
        }
    }
}
